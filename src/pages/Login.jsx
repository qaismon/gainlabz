import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';


const BASE_URL = "https://gain-labz-backend.onrender.com"; 

function Login() {
    const { loginUser, saveNewUser, isLoggedIn } = useContext(ShopContext);
    const navigate = useNavigate();

    const [currentState, setCurrentState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (currentState === "Sign Up") {
            const newUser = await saveNewUser(data.email, data.name, data.password);
            
            if (newUser) {
                toast.success("Account created successfully! Please log in.");
                setCurrentState("Login");
            } else {
                toast.error("Sign Up failed. Email may already be in use.");
            }
            setLoading(false);
            return;
        } 
        
        
        try {
            const response = await fetch(`${BASE_URL}/users?email=${data.email}&password=${data.password}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const loggedInUsers = await response.json();
            
            if (loggedInUsers.length > 0) {
                const user = loggedInUsers[0]; 
                
                loginUser(
                    "fake_token_" + user.id, 
                    user.id,
                    user.email,
                    user.name,
                    user.role || 'user',
                    user.cart,
                    user.orders
                );
                
                toast.success("Login Successful!");
                
                
                if (user.role === 'admin') {
                    navigate('/admin'); 
                } else {
                    navigate('/');
                }

            } else {
                toast.error("Invalid email or password.");
            }

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Check server connection or credentials.");
        }
        
        setLoading(false);
    };

    return (
        <div className='flex justify-center items-center py-10 min-h-[calc(100vh-180px)]'>
            <form 
                onSubmit={handleLogin} 
                className='w-full max-w-md p-8 bg-white shadow-xl rounded-xl space-y-6 border border-gray-200'
            >
                <h2 className='text-3xl font-bold text-gray-800 text-center'>
                    {currentState}
                </h2>

                <div className='space-y-4'>
                    {currentState === "Sign Up" && (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Your Name'
                            required
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Your Email'
                        required
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Password'
                        required
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full p-3 text-white font-semibold rounded-lg transition duration-200 ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {loading ? (currentState === "Login" ? 'Logging In...' : 'Signing Up...') : currentState}
                </button>

                <div className='text-sm text-center'>
                    {currentState === "Login" ? (
                        <p>
                            Don't have an account? <span 
                                onClick={() => setCurrentState("Sign Up")} 
                                className='text-green-500 font-medium cursor-pointer hover:underline'
                            >
                                Sign Up here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account? <span 
                                onClick={() => setCurrentState("Login")} 
                                className='text-green-500 font-medium cursor-pointer hover:underline'
                            >
                                Login here
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Login;