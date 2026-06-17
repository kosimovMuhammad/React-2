const api="https://to-dos-api.softclub.tj/api/to-dos"
import axios from "axios"
import { atom } from "jotai"
import { atomWithRefresh, loadable } from "jotai/utils"
export const getDataAtom=atomWithRefresh(async()=>{
    try { 
        const {data}=await axios.get(api)
        return data.data 
    } catch (error) {
       console.error(error); 
       
    }
})

export const deleteUserAtom=atom(null,async(get, set, id)=>{
    try {
        await axios.delete(`${api}?id=${id}`)
        set(getDataAtom)
    } catch (error) { 
       console.error(error);
        
    } 
})

export const addUserAtom = atom(null, async (get, set, newUser) => {
    try {
        await axios.post(api, newUser)
        set(getDataAtom)
    } catch (error: any) {
        console.error(error.response?.data || error);
    }
})

export const editUserAtom = atom(null, async (get, set, updatedUser) => {
    try {
        await axios.put(api, updatedUser)
        set(getDataAtom)
    } catch (error) {
        console.error(error);
    }
})




export const getLoadableAtom=loadable(getDataAtom)