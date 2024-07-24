import { useContext, useEffect, useState } from "react";
import { useRefetchContext } from "../contexts/RefetchContext";
import { SessionContext } from "../contexts/SessionContext";
import {
  Button,
  Collapse,
  Image,
  NumberInput,
  Switch,
  Table,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack, IconEdit } from "@tabler/icons-react";
import { Form } from "@mantine/form";

const VariantRows = ({ variant }) => {
  // CONTEXTS

  const { fetchWithToken } = useContext(SessionContext);
  const { shouldRefetch, setShouldRefetch } = useRefetchContext();

  //USESTATES

  const [stocks, setStocks] = useState({});
  const [checked, setChecked] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [opened, { toggle }] = useDisclosure(false);
  const [variantFormData, setVariantFormData] = useState({});
  const [productFormData, setProductFormData] = useState({});
  const [stockFormData, setStockFormData] = useState({});

  //FUNCTIONS

  const getStock = async () => {
    try {
      const fetchedStocks = await fetchWithToken(`/stocks/${variant._id}`);
      setStocks(fetchedStocks);
      setStockFormData(fetchedStocks);
    } catch (error) {
      console.log(error);
    }
  };

  const handleActivate = async () => {
    try {
      const activateToggle = await fetchWithToken(
        `/products/variants/activate/${variant._id}`,
        "PUT",
        { active: !checked }
      );
      console.log(activateToggle);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setChecked(event.currentTarget.checked);
    handleActivate();
  };

  const handleInput = (event) => {
    const { name, value } = event.currentTarget;

    // Update the respective form data state based on the name
    if (name in productFormData) {
      setProductFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name in variantFormData) {
      setVariantFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleStockChange = (value) => {
    const realStockValue = value; // value is already a number (or null if empty input)

    if (realStockValue !== null && realStockValue >= 0) {
      const realVirtualDiff = stocks.virtualStock - stocks.realStock;

      setStockFormData({
        realStock: realStockValue,
        virtualStock: realStockValue + realVirtualDiff,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedProduct = await fetchWithToken(
        `/products/${variant.productId._id}`,
        "PUT",
        productFormData
      );
      const updatedVariant = await fetchWithToken(
        `/products/variants/${variant._id}`,
        "PUT",
        variantFormData
      );
      const updatedStock = await fetchWithToken(
        `/stocks/update/${variant._id}`,
        "PUT",
        stockFormData
      );
      setShowContent(true)
      setShouldRefetch(true)
    } catch (error) {
      console.log(error);
    }
  };

  const switchStyles = (theme, { checked }) => ({
    track: {
      backgroundColor: checked ? theme.colors.green[6] : theme.colors.red[6],
    },
    thumb: {
      borderColor: checked ? theme.colors.green[6] : theme.colors.red[6],
    },
  });

  //USEEFFECTS

  useEffect(() => {
    getStock();
    setVariantFormData({
      productId: variant.productId._id,
      category: variant.productId.category,
      price: variant.price,
      color: variant.color,
      size: variant.size,
      imageUrl: variant.imageUrl,
    });
    setProductFormData({
      name: variant.productId.name,
      description: variant.productId.description,
      material: variant.productId.material,
      category: variant.productId.category,
    });
  }, [shouldRefetch]);

  useEffect(() => {
    setChecked(variant.active);
    setVariantFormData({
      productId: variant.productId._id,
      category: variant.productId.category,
      price: variant.price,
      color: variant.color,
      size: variant.size,
      imageUrl: variant.imageUrl,
    });
    setProductFormData({
      name: variant.productId.name,
      description: variant.productId.description,
      material: variant.productId.material,
      category: variant.productId.category,
    });
    getStock();
  }, []);

  return (
    <>
      {/*   TABLE ROW   */}
      <Table.Tr onClick={toggle}>
        <Table.Td>
          <Image src={variant.imageUrl} height={20} alt="product" />
        </Table.Td>
        <Table.Td>{variant.productId.category}</Table.Td>
        <Table.Td>{variant.productId.name}</Table.Td>
        <Table.Td>{variant.color}</Table.Td>
        <Table.Td>{stocks.virtualStock}</Table.Td>
        <Table.Td>{stocks.realStock}</Table.Td>
        <Table.Td>
          <Switch
            checked={checked}
            onChange={handleChange}
            styles={(theme) => switchStyles(theme, { checked })}
          />
        </Table.Td>
        {/*   EXPANDABLE CONTENT - DATA  */}
      </Table.Tr>
      {showContent ? (
        <Table.Tr>
          <Table.Td colSpan="6">
            <Collapse
              in={opened}
              transitionDuration={300}
              transitionTimingFunction="linear"
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h4>Product data</h4>
                  <p>Product Id: {variant.productId._id}</p>
                  <p>Name: {variant.productId.name}</p>
                  <p>Category: {variant.productId.descriptionm}</p>
                  <p>Material: {variant.productId.material}</p>
                </div>
                <div>
                  <h4>Variant data</h4>
                  <p>Variant Id: {variant._id}</p>
                  <p>Color: {variant.color}</p>
                  <p>Size: {variant.size}</p>
                  <p>Price: $ {(variant.price / 100).toFixed(2)}</p>
                  <p>Image: {variant.imageUrl}</p>
                </div>
                <div>
                  <h4>Stock</h4>
                  <p>Real stock: {stocks.realStock}</p>
                  <p>Virtual stock: {stocks.virtualStock}</p>
                  <Button
                    color="yellow"
                    size="compact-md"
                    radius="sm"
                    rightSection={<IconEdit size={20} />}
                    onClick={() => setShowContent(false)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Collapse>
          </Table.Td>
          {/*   EXPANDABLE CONTENT - FORM  */}
        </Table.Tr>
      ) : (
        <Table.Tr>
          <Table.Td colSpan="6">
            <Collapse
              in={opened}
              transitionDuration={300}
              transitionTimingFunction="linear"
            >
              <form onSubmit={handleSubmit}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h4>Product data</h4>
                    <TextInput
                      disabled
                      label="Product Id"
                      placeholder={variant.productId._id}
                    />
                    <TextInput
                      label="Name"
                      name="name"
                      value={productFormData.name}
                      onChange={handleInput}
                    />
                    <TextInput
                      label="Category"
                      name="category"
                      value={productFormData.category}
                      onChange={handleInput}
                    />
                    <TextInput
                      label="Material"
                      name="material"
                      value={productFormData.material}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <h4>Variant data</h4>
                    <TextInput
                      disabled
                      label="Variant Id"
                      placeholder={variant._id}
                    />
                    <TextInput
                      label="Color"
                      name="color"
                      value={variantFormData.color}
                      onChange={handleInput}
                    />
                    <TextInput
                      label="Size"
                      name="size"
                      value={variantFormData.size}
                      onChange={handleInput}
                    />
                    <TextInput
                      label="Price"
                      name="price"
                      value={variantFormData.price}
                      onChange={handleInput}
                    />
                    <TextInput
                      label="Image"
                      name="image"
                      value={variantFormData.imageUrl}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                    <h4>Stock</h4>
                    <NumberInput
                      label="RealStock"
                      name="real stock"
                      value={stockFormData.realStock}
                      min={0}
                      onChange={handleStockChange}
                    />
                    <NumberInput
                      disabled
                      label="Virtual stock"
                      placeholder={stockFormData.virtualStock}
                    />
                    <Button
                      color="yellow"
                      size="compact-md"
                      radius="sm"
                      rightSection={<IconArrowBack size={20} />}
                      onClick={() => setShowContent(true)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      color="blue"
                      size="compact-md"
                      radius="sm"
                      rightSection={<IconEdit size={20} />}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </form>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default VariantRows;
