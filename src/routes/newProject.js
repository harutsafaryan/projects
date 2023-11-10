import { useAuthUser } from "react-auth-kit";
import { Form, redirect } from "react-router-dom";
import { addProject } from "../api/projectApi";
import { getCustomers } from "../api/userApi";
import { useQuery } from "@tanstack/react-query";

export async function loader() {
}

export async function action({ request }) {
    let formData = await request.formData();
    const project = Object.fromEntries(formData);
    const response = await addProject(project);
    console.log('response: ', response);
    return redirect('/projects');
}

export default function NewProject() {
    const auth = useAuthUser();
    const role = auth().role;

    const { isLoading, isError, data: customers, error } = useQuery({
        queryKey: ['customers'],
        queryFn: () => getCustomers()
    })

    if (isLoading) {
        return <span>Loading...</span>
      }
    
      if (isError) {
        return <span>Error: {error.message}</span>
      }

    return (
        <>
            <h1>New project page...</h1>
            <h1>{customers[0].email}</h1>
            <Form method="post">
                <input type="text" name="description" />
                <input type="" name="customerId" />
                <datalist>
                    <option>Red</option>
                    <option>Yellow</option>
                    <option>Green</option>
                    <option>Blue</option>
                </datalist>
                <button>New</button>
            </Form>
        </>
    )
}