import React from 'react';
import { FiX, FiInfo, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const QuickView = ({ product, isOpen, onClose, currency }) => {
    const navigate = useNavigate();

    if (!product) return null;

    // Animation Variants
    const overlayVariants = {
        hidden: { opacity: 0, backdropFilter: "blur(0px)" },
        visible: { opacity: 1, backdropFilter: "blur(8px)" },
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            y: 100, 
            rotateX: 15, 
            scale: 0.9 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6,
                staggerChildren: 0.1, // Stagger children inside the modal
                delayChildren: 0.2
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.9, 
            y: 50,
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4'
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div 
                        className='bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] relative'
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ perspective: 1000 }} // Enables 3D rotation feel
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button with hover effect */}
                        <motion.button 
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className='absolute top-5 right-5 z-20 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors'
                        >
                            <FiX size={20} />
                        </motion.button>

                        <div className='flex flex-col md:flex-row'>
                            {/* Image Section - Animated Slide */}
                            <motion.div 
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className='w-full md:w-1/2 bg-gray-50 h-72 md:h-[500px] overflow-hidden'
                            >
                                <motion.img 
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6 }}
                                    src={product.image?.[0]} 
                                    className='w-full h-full object-cover' 
                                    alt={product.name} 
                                />
                            </motion.div>

                            {/* Content Section */}
                            <div className='p-8 md:p-12 flex-1 flex flex-col justify-center bg-white'>
                                <motion.div variants={itemVariants}>
                                    <span className='inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4'>
                                        {product.category}
                                    </span>
                                    <h2 className='text-3xl md:text-4xl font-black text-gray-900 leading-tight'>
                                        {product.name}
                                    </h2>
                                </motion.div>

                                <motion.div variants={itemVariants} className='flex items-center gap-4 my-6'>
                                    <span className='text-4xl font-black text-gray-900'>
                                        {currency}{product.onSale ? product.offerPrice : product.price}
                                    </span>
                                    {product.onSale && (
                                        <span className='text-xl text-gray-400 line-through decoration-red-500/50'>
                                            {currency}{product.price}
                                        </span>
                                    )}
                                </motion.div>

                                <motion.p variants={itemVariants} className='text-gray-500 leading-relaxed text-base'>
                                    {product.description || "Premium formula engineered for maximum performance and recovery."}
                                </motion.p>

                                {product.flavor && (
                                    <motion.div variants={itemVariants} className='mt-8'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3'>Select Flavor</p>
                                        <div className='flex flex-wrap gap-2'>
                                            {product.flavor.map(f => (
                                                <span key={f} className='px-4 py-2 border border-gray-100 bg-gray-50 text-gray-700 text-xs rounded-xl font-bold hover:border-green-500 transition-colors cursor-default'>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className='mt-10'>
                                    <button 
                                        onClick={() => {
                                            navigate(`/product/${product.id}`);
                                            onClose();
                                        }}
                                        className='group flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-600 transition-all active:scale-[0.98] shadow-xl shadow-gray-200'
                                    >
                                        View Full Details
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickView;