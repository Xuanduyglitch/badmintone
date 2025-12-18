import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, CheckCircle, XCircle, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register({ isOpen, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. BỘ LỌC REGEX (Theo yêu cầu của bạn)
    // Chỉ cho phép chữ và số, KHÔNG cho phép ký tự đặc biệt hay dấu cách
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(username)) {
      setNotification({
        type: 'error',
        message: 'Tên đăng nhập chỉ được chứa Chữ và Số (không dấu cách, không ký tự đặc biệt)!',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (username.length < 3) {
      setNotification({
        type: 'error',
        message: 'Tên đăng nhập quá ngắn (tối thiểu 3 ký tự)!',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // 2. GỌI API ĐĂNG KÝ
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Đăng ký thành công! Đang chuyển sang đăng nhập...',
        });
        
        
        setTimeout(() => {
          setUsername('');
          setPassword('');
          setNotification(null);
          onSwitchToLogin(); 
        }, 1500);
      } else {
        setNotification({
          type: 'error',
          message: data.message,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Lỗi kết nối Server! Vui lòng thử lại sau.',
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Dùng màu Xanh lá (Green) để phân biệt với Login (Cam) */}
          <div className="relative bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UserPlus size={28}/> Đăng Ký
            </h2>
            <p className="text-green-100 text-sm mt-1">Tạo tài khoản mới trong tích tắc</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đăng nhập (Chữ & Số)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: duy123"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none transition-colors text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none transition-colors text-gray-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Đã có tài khoản?{' '}
              <button 
                type="button"
                onClick={onSwitchToLogin} 
                className="text-green-700 hover:text-green-800 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
          </form>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
            >
              {notification.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
              <p className="font-semibold">{notification.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}