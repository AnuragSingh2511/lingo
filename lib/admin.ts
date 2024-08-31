import { auth } from "@clerk/nextjs/server";

const adminIds = [
    "user_2keffw1OZZAhJpZGLEen9OWj5ly",
]

export const isAdmin = () => {
    const { userId } =  auth();

    if(!userId){
        return false
    }

    return adminIds.indexOf(userId) !== -1
}