import { useSignIn } from "react-auth-kit";
import { Form, useNavigate } from "react-router-dom";
import { URI } from '../utility/constants'
import { useState } from "react";
import axios from "axios";

export default function Login() {

    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const signIn = useSignIn();

    const onSubmit = async () => {
        try {
            const response = await axios.post(`${URI}/Authentication/signin`, { user, password });
            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { user: response.data.user, id: response.data.id, role: response.data.role }
            })
        }
        catch (error) {
        console.error("Error from login: ", error);
        }
    }

    return (
        <Form
        onSubmit={event => {
            event.preventDefault();
            onSubmit()
        }}>
        <div style={{
            position:'absolute',
            top:'50%',
            left:"50%",
            marginTop:'-150px',
            marginLeft:'-150px',
            width:'300px',
            height:'300px',
        }}>
            <div className="form-outline mb-4" style={{}}>
                <label className="form-label">User name</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={event => setUser(event.target.value)}>
                </input>
            </div>
            <div className="form-outline mb-4">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    required
                    className="form-control"
                    onChange={event => setPassword(event.target.value)}>
                </input>
            </div>
            <div className="mb-3">
                <button className="btn btn-primary">sign in</button>
            </div>
        </div>
    </Form >
    )
}