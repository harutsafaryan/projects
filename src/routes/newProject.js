import { useAuthUser } from "react-auth-kit";
import { Form, redirect } from "react-router-dom";
import { addProject } from "../api/projectApi";
import { getCustomers } from "../api/userApi";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const customersQuery = () => ({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
})

export const loader = (queryClient) =>
    async () => {
        const query = customersQuery()
        return queryClient.getQueryData(query.queryKey) ??
            await queryClient.fetchQuery(query)
    }

export const action = (queryClient) =>
    async ({ request }) => {
        let formData = await request.formData();
        const project = Object.fromEntries(formData);
        const response = await addProject(project);
        if (response.status === 200) {
            await queryClient.invalidateQueries({ queryKey: ['projects'] })
            return redirect('/');
        }
        else {
            throw new Response('', {
                status: 404,
                statusText: 'Not Found'
            })
        }
    }

export default function NewProject() {
    const auth = useAuthUser();
    const { isLoading, isError, data: customers, error } = useQuery(customersQuery())

    if (isLoading)
        return <span>Loading...</span>

    if (isError)
        return <span>Error: {error.message}</span>

    let clientList = null;
    if (auth().role === 'employee') {
        clientList = (
            <select name="customerId">
                {customers.map(client => <option key={client.id} value={client.id}>{client.userName}</option>)}
            </select>
        )
    }
    else {
        clientList = <input type="text" name="customerId" value={auth().id} ></input>
    }

    return (
        <>
            <h1>New project page...</h1>
            <Form method="post">
                <input type="text" name="description" />
                {clientList}
                <button>Save</button>
            </Form>
        </>
    )
}