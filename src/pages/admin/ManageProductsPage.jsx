import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { useRefetchContext } from "../../contexts/RefetchContext";
import { Button, Modal, NumberInput, Table, TextInput } from "@mantine/core";
import VariantRows from "../../components/VariantRows";
import { IconArrowBack, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const ManageProductsPage = () => {
  const [variants, setVariants] = useState([]);
  const [addData, setAddData] = useState({
    name: "",
    description: "",
    material: "",
    productId: "",
    category: "",
    price: 0,
    color: "",
    size: "",
    imageUrl: "",
  });
  const [opened, { open, close }] = useDisclosure(false);

  const { fetchWithToken } = useContext(SessionContext);

  const { shouldRefetch, setShouldRefetch } = useRefetchContext();
  

  const getVariants = async () => {
    try {
      const fetchedVariants = await fetchWithToken("/products/variants");
      setVariants(fetchedVariants);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.currentTarget;
      setAddData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newVariant = await fetchWithToken(
        `/products`,
        "POST",
        addData
      );
      close()
      setShouldRefetch((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVariants();
    setAddData({
      name: "",
      description: "",
      material: "",
      productId: "",
      category: "",
      price: 0,
      color: "",
      size: "",
      imageUrl: "",
    })
  }, [shouldRefetch]);

  useEffect(() => {
    getVariants();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Products</h1>

        <Button
          onClick={open}
          rightSection={<IconSquareRoundedPlus size={26} />}
        >
          Add
        </Button>
        <Modal
          opened={opened}
          onClose={close}
          title="Add a product/variant"
          size="75%"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4>Product data</h4>
                <TextInput
                  label="Product Id"
                  name="productId"
                  value={addData.productId}
                  onChange={handleInput}
                />
                <TextInput
                  label="Name"
                  name="name"
                  value={addData.name}
                  onChange={handleInput}
                />
                                <TextInput
                  label="Description"
                  name="description"
                  value={addData.description}
                  onChange={handleInput}
                />
                <TextInput
                  label="Category"
                  name="category"
                  value={addData.category}
                  onChange={handleInput}
                />
                <TextInput
                  label="Material"
                  name="material"
                  value={addData.material}
                  onChange={handleInput}
                />
              </div>
              <div>
                <h4>Variant data</h4>
                <TextInput
                  label="Color"
                  name="color"
                  value={addData.color}
                  onChange={handleInput}
                />
                <TextInput
                  label="Size"
                  name="size"
                  value={addData.size}
                  onChange={handleInput}
                />
                <TextInput
                  label="Price"
                  name="price"
                  value={addData.price}
                  onChange={handleInput}
                />
                 <TextInput
                  label="Image"
                  name="imageUrl"
                  value={addData.imageUrl}
                  onChange={handleInput}
                />
              </div>
              <div>
                <Button
                  color="yellow"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconArrowBack size={20} />}
                  onClick={close}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconSquareRoundedPlus size={20} />}
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
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
        <Table.Tbody>
          {variants.map((eachVariant) => {
            return <VariantRows key={eachVariant._id} variant={eachVariant} />;
          })}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default ManageProductsPage;
