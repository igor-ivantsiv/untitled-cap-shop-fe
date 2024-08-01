import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { useRefetchContext } from "../../contexts/RefetchContext";
import {
  Button,
  Modal,
  Table,
  TextInput,
} from "@mantine/core";
import VariantRows from "../../components/VariantRows";
import { IconArrowBack, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import styles from "../../styles/Dashboard.module.css";

const ManageProductsPage = () => {
  //CONTEXTS
  const { fetchWithToken } = useContext(SessionContext);
  const { shouldRefetch, setShouldRefetch } = useRefetchContext();
//USEEFFECTS
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
  const [modalWidth, setModalWidth] = useState("75%");
  const [opened, { open, close }] = useDisclosure(false);

//FUNCTIONS
  const getVariants = async () => {
    try {
      const fetchedVariants = await fetchWithToken("/products/all-variants");
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
      const newVariant = await fetchWithToken(`/products`, "POST", addData);
      close();
      setShouldRefetch((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

//USEEFFECTS
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
    });
  }, [shouldRefetch]);

  useEffect(() => {
    getVariants();
    const updateModalWidth = () => {
      if (window.innerWidth < 768) {
        setModalWidth("95%");
      } else {
        setModalWidth("75%");
      }
    };
    updateModalWidth();
    window.addEventListener("resize", updateModalWidth);
    return () => {
      window.removeEventListener("resize", updateModalWidth);
    };
  }, []);

  return (
    <>
      <div>
        <div className={styles.headerDiv}>
          <h1>Products</h1>

          <Button
            onClick={open}
            rightSection={<IconSquareRoundedPlus size={26} />}
          >
            Add
          </Button>
        </div>
        <Modal
          opened={opened}
          onClose={close}
          title="Add a product/variant"
          size={modalWidth}
          classNames={{
            title: `${styles.formTitle}`,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className={styles.newProductFormDiv}>
              <div>
                <h3>Product data</h3>
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
                <TextInput
                  label="Description"
                  name="description"
                  value={addData.description}
                  onChange={handleInput}
                />
              </div>
              <div>
                <h3>Variant data</h3>
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
              <div className={styles.newProductModalButtons}>
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

      <Table
        withTableBorder
        verticalSpacing="lg"
        className={styles.tableContentStyles}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={styles.tableHeaders}>Image</Table.Th>
            <Table.Th
              className={`${styles.tableHeaders} ${styles.hideOnMobile}`}
            >
              Category
            </Table.Th>
            <Table.Th className={styles.tableHeaders}>Name</Table.Th>
            <Table.Th className={styles.tableHeaders}>Color</Table.Th>
            <Table.Th className={styles.tableHeaders}>V.stock</Table.Th>
            <Table.Th
              className={`${styles.tableHeaders} ${styles.hideOnMobile}`}
            >
              R.stock
            </Table.Th>
            <Table.Th className={styles.tableHeaders}>Active</Table.Th>
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
