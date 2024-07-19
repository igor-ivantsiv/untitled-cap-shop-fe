import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";

const User = () => {

    const {currentUser} = useContext(SessionContext)
    return (
    <>
    <h1>User Page</h1>
    {currentUser && <h2>Current user: {currentUser}</h2>}
    </>
    )
}

export default User;