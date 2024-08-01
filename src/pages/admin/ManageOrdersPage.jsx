import { useContext, useEffect, useState } from "react";

import { Table } from '@mantine/core';
import { SessionContext } from "../../contexts/SessionContext";
import TableRowItem from "../../components/TableRowItem";
import { useRefetchContext } from "../../contexts/RefetchContext";
import styles from "../../styles/Dashboard.module.css";


const ManageOrdersPage = () => {
//CONTEXTS
  const { fetchWithToken } = useContext(SessionContext)
  const { shouldRefetch } = useRefetchContext();

//USESTATES
  const [orders, setOrders] = useState([]);

//FUNCTIONS
  const getOrders = async () => {
    try {
      const fetchedOrders = await fetchWithToken("/orders");
      setOrders(fetchedOrders)
    } catch (error) {
      console.log(error) 
    }
  }

  //USEEFFECTS
  useEffect(() => {
    getOrders();
  }, [shouldRefetch]);

  useEffect(() => {
    getOrders();
  }, []);

    return <>
    <h1 className={styles.ordersHeader}>Orders</h1>
    <Table         withTableBorder
        verticalSpacing="sm"
        className={styles.tableContentStyles}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={styles.tableHeaders}>Order Id</Table.Th>
          <Table.Th className={styles.tableHeaders}>Status</Table.Th>
          <Table.Th className={styles.tableHeaders}>Name</Table.Th>
          <Table.Th className={`${styles.tableHeaders} ${styles.hideOnMobile}`}>Total</Table.Th>
          <Table.Th className={styles.tableHeaders}>Created at</Table.Th>
          <Table.Th  className={`${styles.tableHeaders} ${styles.hideOnMobile}`}>Shipped at</Table.Th>
          <Table.Th  className={`${styles.tableHeaders} ${styles.hideOnMobile}`}>Tracking Id</Table.Th>
          <Table.Th  className={`${styles.tableHeaders} ${styles.hideOnMobile}`}>Cancelled at</Table.Th>
          <Table.Th  className={`${styles.tableHeaders} ${styles.hideOnMobile}`}>Cancellation reason</Table.Th>
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