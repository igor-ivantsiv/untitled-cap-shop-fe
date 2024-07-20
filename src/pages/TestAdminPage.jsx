import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";

const TestAdminPage = () => {

    const {currentUser} = useContext(SessionContext)
    return (
    <>
    <h1>Admin Page</h1>
    {currentUser && <h2>Current user: {currentUser}</h2>}
    </>
    )
}

export default TestAdminPage;