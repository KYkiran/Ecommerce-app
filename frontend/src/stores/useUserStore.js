import {create} from 'zustand';
import axios from '../lib/axios.js';
import {toast} from 'react-hot-toast';

export const useUserStore = create((set,get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup:async ({name,email,password,confirmPassword})=>{
        set({loading:true});
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            set({loading:false});
            return;
        }
        try {
            const res = await axios.post('/auth/signup', {name,email,password});
            set({user:res.data, loading:false});
        } catch (error) {
            set({loading:false});
            console.error(error);
            toast.error(error.response.data.message || "Something went wrong");            
        }
    },
    login:async({email,password})=>{

        set({loading:true});
        if(!email || !password){
            toast.error("Email and password are required");
            set({loading:false});
            return;
        }
        try {
            const res = await axios.post('/auth/login', {email,password});
            toast.success("Login successful");
            set({user:res.data, loading:false});        
        } catch (error) {
            set({loading:false});
            console.error(error);
            toast.error(error.response.data.message || "Something went wrong");            
        }
    },
    logout:async()=>{
        try {
            await axios.post('/auth/logout');
            set({user:null});
            toast.success("Logout successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },
    checkAuth:async()=>{
        set({checkingAuth:true});
        try {
            const res = await axios.get('/auth/profile');
            set({user:res.data, checkingAuth:false});
        } catch (error) {
            console.log(error.message);
			set({ checkingAuth: false, user: null });
        }
    }
}));
