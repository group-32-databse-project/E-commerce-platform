import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Use named import

const MyOrder = () => {
    const token = localStorage.getItem('token');
    let id = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token); // Use named import
            id = decodedToken.customerId; // Assuming the token contains an 'id' field
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
             // id=1;
                const response = await axios.get(`/api/orders/${id}/customer`);
                const data = response.data;

                // Process the data to group items by order_id
                const groupedOrders = data.reduce((acc, item) => {
                    const orderId = item.order_id;
                    if (!acc[orderId]) {
                        acc[orderId] = {
                            order_id: item.order_id,
                            user_id: item.user_id,
                            delivery_module_id: item.delivery_module_id,
                            order_date: item.order_date,
                            payment_method_id: item.payment_method_id,
                            delivery_method: item.delivery_method,
                            delivery_address_id: item.delivery_address_id,
                            total_order_price: item.total_order_price,
                            order_status: item.order_status,
                            updated_at: item.updated_at,
                            items: []
                        };
                    }
                    acc[orderId].items.push({
                        order_item_id: item.order_item_id,
                        variant_id: item.variant_id,
                        quantity: item.quantity,
                        price: item.price,
                        product_id: item.product_id,
                        inventory_stock: item.inventory_stock,
                        total_price: item.total_price,
                        variant_image: item.variant_image,
                        SKU: item.SKU,
                        Arrived_date: item.Arrived_date,
                        product_name: item.product_name,
                        description: item.description,
                        product_image: item.product_image,
                        weight: item.weight
                    });
                    return acc;
                }, {});

                setOrders(Object.values(groupedOrders));
                console.log('Orders:', Object.values(groupedOrders));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (id) {
            fetchOrders();
        }
    }, [id]);

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
                        background-color: #f9f9f9;
                        width: 120%;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        margin-left: -20px;
                        padding: 10px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        display: flex;
                        align-items: center;
                    }
                    .item-image {
                        width: 50px;
                        height: 50px;
                        margin-right: 10px;
                    }
                    .item-name {
                        font-weight: bold;
                        color: #333;
                        flex: 1;
                    }
                    .item-quantity, .item-price, .item-arrived-date {
                        color: #777;
                        margin-left: 10px;
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
            {orders.length===0 ? (
                <p className="no-orders">You have no orders.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order, index) => (
                        <li key={index} className="order-item">
                            <div className="order-header">
                               
                                <span className="order-date">Ordered Date: {new Date(order.order_date).toLocaleDateString()}
                                   
                                </span>
                                
                            </div>
                            <div className="order-details">
                                {order.items && order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-detail">
                                        <img src={item.variant_image} alt={item.product_name} className="item-image" />
                                        <span className="item-name">{item.product_name}</span>
                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                        <span className="item-price">${item.total_price}</span>
                                        <span className="item-arrived-date">Arrived Date: {new Date(item.Arrived_date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                Total: ${order.total_order_price}
                                <br></br>
                                status: {order.order_status}
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