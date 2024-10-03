import React from 'react';

const Guest = () => {
    const handleSignIn = () => {
        // Handle sign-in logic here
        console.log('Sign In clicked');
    };

    const handleLogIn = () => {
        // Handle log-in logic here
        console.log('Log In clicked');
    };

    const handleContinueAsGuest = () => {
        // Handle continue as guest logic here
        console.log('Continue as Guest clicked');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Welcome</h1>
            <button onClick={handleSignIn} style={{ margin: '10px', padding: '10px 20px' }}>Sign In</button>
            <button onClick={handleLogIn} style={{ margin: '10px', padding: '10px 20px' }}>Log In</button>
            <button onClick={handleContinueAsGuest} style={{ margin: '10px', padding: '10px 20px' }}>Continue as Guest</button>
        </div>
    );
};

export default Guest;