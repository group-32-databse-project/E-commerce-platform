import React from 'react';
import PropTypes from 'prop-types';

const MyOrder = ({ orders = [] }) => { // Provide a default value for orders
    return (
        <div className="orders-container">
            <style>
                {`
                    .orders-container {
                        padding: 20px;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .orders-title {
                        font-size: 24px;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    .no-orders {
                        font-size: 18px;
                        color: #777;
                    }
                    .orders-list {
                        list-style-type: none;
                        padding: 0;
                    }
                    .order-item {
                        background-color: #fff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    }
                    .order-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }
                    .order-id, .order-date {
                        font-size: 16px;
                        color: #555;
                    }
                    .order-details {
                        margin-bottom: 10px;
                    }
                    .order-item-detail {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .item-name {
                        font-weight: bold;
                        color: #333;
                    }
                    .item-quantity, .item-price {
                        color: #777;
                    }
                    .order-total {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                        text-align: right;
                    }
                `}
            </style>
            <h2 className="orders-title">My Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">You have no orders.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order, index) => (
                        <li key={index} className="order-item">
                            <div className="order-header">
                                <span className="order-id">Order ID: {order.id}</span>
                                <span className="order-date">Date: {order.date}</span>
                            </div>
                            <div className="order-details">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-detail">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                        <span className="item-price">${item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                Total: ${order.total}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

MyOrder.propTypes = {
    orders: PropTypes.array, // Validate that orders is an array
};

export default MyOrder;