// FileUploader.js
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
  Stack,
  Button,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  ErrorOutline as ErrorIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import axios from "axios";

// Styled components
const UploadBox = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(3),
  border: "2px dashed",
  borderColor: isDragging
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  backgroundColor: isDragging
    ? theme.palette.primary.lighter
    : theme.palette.grey[50],
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lighter,
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const FileProgressWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: theme.spacing(1),
}));

// File upload status enum
const UploadStatus = {
  PENDING: "pending",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
};

const FileUploader = ({
  endpoint = "/api/upload",
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
  maxFiles = 5,
  onUploadComplete,
  onError,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const abortControllerRef = useRef({});
  const uploadQueueRef = useRef([]);
  const processingRef = useRef(false);
  const intervalsRef = useRef({}); // To store interval IDs

  // File interface
  const createFileObject = (file) => ({
    id: Math.random().toString(36).substr(2, 9),
    file,
    status: UploadStatus.PENDING,
    progress: 0,
    error: null,
    url: null,
  });

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`,
      };
    }
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size too large. Maximum size: ${formatFileSize(
          maxFileSize
        )}`,
      };
    }
    if (files.length >= maxFiles) {
      return {
        valid: false,
        error: `Maximum ${maxFiles} files allowed`,
      };
    }
    return { valid: true };
  };

  const processUploadQueue = async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (uploadQueueRef.current.length > 0) {
      const fileObj = uploadQueueRef.current[0];
      await uploadFile(fileObj);
      uploadQueueRef.current.shift();
    }

    processingRef.current = false;
  };

  const uploadFile = async (fileObj) => {
    try {
      let progress = 0;

      // Start with setting the uploading status
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      // Create interval for progress simulation
      const interval = setInterval(() => {
        progress += 10;

        if (progress >= 100) {
          clearInterval(interval);
          // Set success status
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "success",
                    progress: 100,
                    url: URL.createObjectURL(fileObj.file),
                  }
                : f
            )
          );
          onUploadComplete?.({ url: URL.createObjectURL(fileObj.file) });
        } else {
          // Update progress
          setFiles((prev) =>
            prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
          );
        }
      }, 200);

      // Store the interval ID in the file object
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, intervalId: interval } : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id
            ? {
                ...f,
                status: UploadStatus.ERROR,
                error: "Upload simulation failed",
              }
            : f
        )
      );
      onError?.(error);
    }
  };

  const handleFiles = useCallback(
    (newFiles) => {
      const filesToAdd = [];
      const errors = [];

      Array.from(newFiles).forEach((file) => {
        const { valid, error } = validateFile(file);
        if (valid) {
          const fileObj = createFileObject(file);
          filesToAdd.push(fileObj);
          uploadQueueRef.current.push(fileObj);
        } else {
          errors.push(error);
        }
      });

      if (errors.length) {
        setGlobalError(errors.join(". "));
        setTimeout(() => setGlobalError(""), 5000);
      }

      if (filesToAdd.length) {
        setFiles((prev) => [...prev, ...filesToAdd]);
        processUploadQueue();
      }
    },
    [files.length]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const cancelUpload = (fileId) => {
    if (abortControllerRef.current[fileId]) {
      abortControllerRef.current[fileId].abort();
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const retryUpload = (fileObj) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileObj.id
          ? { ...f, status: UploadStatus.PENDING, progress: 0, error: null }
          : f
      )
    );
    uploadQueueRef.current.push(fileObj);
    processUploadQueue();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileStatus = (fileObj) => {
    switch (fileObj.status) {
      case UploadStatus.UPLOADING:
        return (
          <FileProgressWrapper>
            <LinearProgress
              variant="determinate"
              value={fileObj.progress}
              sx={{ width: "100%", mr: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              {Math.round(fileObj.progress)}%
            </Typography>
          </FileProgressWrapper>
        );
      case UploadStatus.ERROR:
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <ErrorIcon color="error" />
            <Typography variant="body2" color="error">
              {fileObj.error}
            </Typography>
            <Button size="small" onClick={() => retryUpload(fileObj)}>
              Retry
            </Button>
          </Stack>
        );
      case UploadStatus.SUCCESS:
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              color="primary"
              onClick={() => window.open(fileObj.url, "_blank")}
            >
              <DownloadIcon />
            </IconButton>
            <Typography variant="body2" color="success.main">
              Upload complete
            </Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  // Cleanup function to clear intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []); // Empty dependency array ensures this runs once on unmount

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <UploadBox
        elevation={0}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        isDragging={isDragging}
        onClick={() => document.getElementById("file-input").click()}
      >
        <Stack spacing={2} alignItems="center">
          <UploadIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h6" color="primary">
            Drop payment proof here
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or click to select files
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supports:{" "}
            {allowedTypes.map((type) => type.split("/")[1]).join(", ")} (max{" "}
            {formatFileSize(maxFileSize)} per file)
          </Typography>
          <HiddenInput
            id="file-input"
            type="file"
            multiple
            accept={allowedTypes.join(",")}
            onChange={handleFileInput}
            onClick={(e) => (e.target.value = null)}
          />
        </Stack>
      </UploadBox>

      {globalError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => setGlobalError("")}
        >
          {globalError}
        </Alert>
      )}

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((fileObj) => (
            <ListItem
              key={fileObj.id}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                mb: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <FileIcon sx={{ mr: 2 }} />
              <ListItemText
                primary={fileObj.file.name}
                secondary={
                  <React.Fragment>
                    {formatFileSize(fileObj.file.size)}
                    {renderFileStatus(fileObj)}
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => cancelUpload(fileObj.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploader;
