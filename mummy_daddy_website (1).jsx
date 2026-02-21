// Updated mummy_daddy_website.jsx for production readiness

import React, { useState, useEffect } from 'react';
import Razorpay from 'razorpay';

const MummyDaddyWebsite = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);

        // Fetch real product images
        fetch('/api/products')
            .then(response => response.json())
            .then(data => setProductImages(data.images))
            .catch(err => setError('Could not fetch product images.'));
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        const razorpayKey = 'YOUR_TEST_KEY';  // Replace with the working Razorpay test key

        const options = {
            key: razorpayKey,
            amount: 50000, // Amount in paise
            currency: 'INR',
            name: 'Mummy Daddy',
            description: 'Test transaction',
            image: productImages[0] || '',
            order_id: 'order_DBJOWzybf0sJzD', // Sample Order ID
            handler: function (response) {
                console.log(response);
                alert('Payment successful!');
            },
            prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999',
            },
            notes: {
                address: 'note address',
            },
            theme: {
                color: '#F37254',
            }
        };

        const rzp = new Razorpay(options);

        rzp.open();
        rzp.on('payment.failed', function (response) {
            setLoading(false);
            setError('Payment failed! Please try again.');
        });
    };

    const addToCart = (product) => {
        const updatedCart = [...cart, product];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div>
            <h1>Mummy Daddy</h1>
            {loading && <p>Loading payment...</p>}
            {error && <p>{error}</p>}
            <button onClick={handlePayment}>Pay Now</button>
            <div>
                {productImages.map((image, index) => (
                    <img key={index} src={image} alt={`Product ${index}`} />
                ))}
            </div>
        </div>
    );
};

export default MummyDaddyWebsite;