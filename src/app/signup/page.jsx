'use client';

import { authClient } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLink, HiOutlineLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast'; 

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

 
  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating your account...");

    try {
      const { data: signUpData, error: signUpError } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.imageUrl,
        role: data.role
      });

      if (signUpError) {
        toast.dismiss(loadingToast);
        toast.error(signUpError.message || "Sign up failed! Please try again.");
        console.error("Sign up error:", signUpError);
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Account created successfully! Redirecting...");
      
      setTimeout(() => {
        router.push('/login'); 
      }, 1500);
      
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please check your connection.");
      console.error("Something went wrong:", err);
    }
  };

 
  const handleGoogleSignIn = async () => {
    const loadingToast = toast.loading("Connecting to Google...");
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard' 
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Google sign in failed. Please try again.");
      console.error("Google sign in error:", err);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-400/10 rounded-full blur-[100px]"></div>

      <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join us today! Please fill in your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineUser className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineEnvelope className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
                placeholder="Email Address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineLink className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                {...register("imageUrl", { required: "Profile image URL is required" })}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
                placeholder="Profile Image URL"
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.imageUrl.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <select
                id="role"
                {...register("role", { required: "Role is required" })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm cursor-pointer appearance-none"
              >
                <option value="">Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="artist">Artist</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register("password", { 
                    required: "Password is required", 
                    maxLength: { value: 12, message: "Max 12 chars" }, 
                    minLength: { value: 6, message: "Min 6 chars" } 
                  })}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword", { 
                    required: "Required",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all sm:text-sm"
                  placeholder="Confirm"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative px-4 text-xs bg-white text-slate-400 uppercase tracking-widest font-semibold">
            Or
          </span>
        </div>

        
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}