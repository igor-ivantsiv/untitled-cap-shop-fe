import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { useRefetchContext } from "../../contexts/RefetchContext";
import { Table } from "@mantine/core";
import VariantRows from "../../components/VariantRows";

const ManageProductsPage = () => {
  const [variants, setVariants] = useState([]);

  const { fetchWithToken } = useContext(SessionContext)

  const { shouldRefetch } = useRefetchContext();

  const getVariants = async () => {
    try {
      const fetchedVariants = await fetchWithToken("/products/variants");
      setVariants(fetchedVariants)
    } catch (error) {
      console.log(error) 
    }
  }
  useEffect(() => {
    getVariants();
  }, [shouldRefetch]);

  useEffect(() => {
    getVariants();
  }, []);

    return <>
    <h1>Products</h1>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Image</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Color</Table.Th>
          <Table.Th>Virtual stock</Table.Th>
          <Table.Th>Real stock</Table.Th>
          <Table.Th>Active</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{variants.map((eachVariant) => {
        return (
          <VariantRows key={eachVariant._id} variant={eachVariant} />
        );
      })}</Table.Tbody>
    </Table>
    </>
  };
  
  export default ManageProductsPage;