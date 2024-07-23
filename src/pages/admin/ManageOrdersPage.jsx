import { useContext, useEffect, useState } from "react";

import { Table } from '@mantine/core';
import { SessionContext } from "../../contexts/SessionContext";
import TableRowItem from "../../components/TableRowItem";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const { fetchWithToken } = useContext(SessionContext)

  const getOrders = async () => {
    try {
      const fetchedOrders = await fetchWithToken("/orders");
      setOrders(fetchedOrders)
    } catch (error) {
      console.log(error) 
    }
   
  }

  useEffect(() => {
    getOrders();
  }, []);

    return <>
    <h1>Orders</h1>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order Id</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Total paid</Table.Th>
          <Table.Th>Created at</Table.Th>
          <Table.Th>Shipped at</Table.Th>
          <Table.Th>Tracking Id</Table.Th>
          <Table.Th>Cancelled at</Table.Th>
          <Table.Th>Cancellation reason</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{orders.map((eachOrder) => {
        return (
          <TableRowItem key={eachOrder._id} order={eachOrder} />
        );
      })}</Table.Tbody>
    </Table>
    </>
  };
  
  export default ManageOrdersPage;