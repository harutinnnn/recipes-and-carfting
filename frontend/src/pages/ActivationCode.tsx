import { NavLink } from "react-router-dom";

const ActivationCode = () => {
    return (<>
            <div className={"page-header mb-20"}>
                <h1>Wrong activation code</h1>
                <NavLink to="/auth">Login</NavLink>
            </div>
        </>
    );
};

export default ActivationCode;