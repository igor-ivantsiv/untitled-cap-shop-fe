import { useContext, useEffect, useState } from "react";
import { useRefetchContext } from "../contexts/RefetchContext";
import { SessionContext } from "../contexts/SessionContext";
import {
  AspectRatio,
  Button,
  Collapse,
  Image,
  Modal,
  NumberInput,
  Switch,
  Table,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack, IconEdit, IconTrash } from "@tabler/icons-react";
import styles from "../styles/Dashboard.module.css";

const VariantRows = ({ variant }) => {
  // CONTEXTS

  const { fetchWithToken } = useContext(SessionContext);
  const { shouldRefetch, setShouldRefetch } = useRefetchContext();

  //USESTATES

  const [stocks, setStocks] = useState({});
  const [checked, setChecked] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [opened, { toggle }] = useDisclosure(false);
  const [openedWarn, { open, close }] = useDisclosure(false);
  const [variantFormData, setVariantFormData] = useState({});
  const [productFormData, setProductFormData] = useState({});
  const [stockFormData, setStockFormData] = useState({});
  const [colSpan, setColSpan] = useState(7);


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
      setShowContent(true);
      setShouldRefetch((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const deletedVariant = await fetchWithToken(
        `/products/variants/${variant._id}`,
        "DELETE",
        {}
      );
      close();
      setShouldRefetch((prevState) => !prevState);
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
    const updateColSpan = () => {
      if (window.innerWidth < 768) {
        setColSpan(5); 
      } else {
        setColSpan(7); 
      }
    };

    // Initial check
    updateColSpan();

    // Event listener for window resize
    window.addEventListener('resize', updateColSpan);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', updateColSpan);
    };
  }, []);

  return (
    <>
      {/*   TABLE ROW   */}
      <Table.Tr onClick={toggle}>
        <Table.Td className={styles.productRowFormatting}>
        <AspectRatio ratio={1080 / 720} maw={50} mx="auto">
          <Image src={variant.imageUrl} height={50}alt="product" />
          </AspectRatio>
        </Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          {variant.productId.category}
        </Table.Td>
        <Table.Td>{variant.productId.name}</Table.Td>
        <Table.Td>{variant.color}</Table.Td>
        <Table.Td>{stocks.virtualStock}</Table.Td>
        <Table.Td className={styles.hideOnMobile}>{stocks.realStock}</Table.Td>
        <Table.Td >
          <div style={{display:"flex", justifyContent:"center"}}>
          <Switch
            checked={checked}
            onChange={handleChange}
            styles={(theme) => switchStyles(theme, { checked })}
          />
          </div>
        </Table.Td> 
        {/*   EXPANDABLE CONTENT - DATA  */}
      </Table.Tr>
      {showContent ? (
        <Table.Tr>
          <Table.Td colSpan={colSpan} className={styles.expandableRow}>
            <Collapse
              in={opened}
              transitionDuration={300}
              transitionTimingFunction="linear"
            >
              <div className={styles.expandableContentDiv}>
                <div>
                  <div className={styles.flexOnlyDiv}>
                    <h3>Product</h3>
                    <p className={styles.idStyle}>{variant.productId._id}</p>
                  </div>
                  <div className={styles.gridDiv}>
                  <p><span className={styles.dataLabel}>Name:</span> {variant.productId.name}</p>
                  <p><span className={styles.dataLabel}>Category:</span> {variant.productId.category}</p>
                  <p><span className={styles.dataLabel}>Material: </span>{variant.productId.material}</p>
                  </div>
                  <p><span className={styles.dataLabel}>Description:</span> {variant.productId.description}</p>

                </div>
                <div>
                <div className={styles.flexOnlyDiv}>
                    <h3>Variant</h3>
                    <p className={styles.idStyle}>{variant._id}</p>
                  </div>
                  <div className={styles.gridDiv}>
                  <p><span className={styles.dataLabel}>Color:</span> {variant.color}</p>
                  <p><span className={styles.dataLabel}>Size:</span> {variant.size}</p>
                  <p><span className={styles.dataLabel}>Price:</span> ${(variant.price / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <h3>Stock</h3>
                  <div className={styles.stockContent}>
                  <p><span className={styles.dataLabel}>Real stock:</span> {stocks.realStock}</p>
                  <p><span className={styles.dataLabel}>Virtual stock:</span> {stocks.virtualStock}</p>
                  </div>
                  <div className={styles.editButtonDiv}>
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
              </div>
            </Collapse>
          </Table.Td>
          {/*   EXPANDABLE CONTENT - FORM  */}
        </Table.Tr>
      ) : (
        <Table.Tr>
          <Table.Td colSpan="6" className={styles.expandableRow}>
            <Collapse
              in={opened}
              transitionDuration={300}
              transitionTimingFunction="linear"
            >
              <form onSubmit={handleSubmit}>
                <div
                  className={styles.expandableContentDiv}
                >
                  <div>
                  <div className={styles.flexOnlyDiv}>
                    <h3>Product</h3>
                    <p className={styles.idStyle}>{variant.productId._id}</p>
                  </div>
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
                                        <TextInput
                      label="Description"
                      name="description"
                      value={productFormData.description}
                      onChange={handleInput}
                    />
                  </div>
                  <div>
                  <div className={styles.flexOnlyDiv}>
                    <h3>Variant</h3>
                    <p className={styles.idStyle}>{variant._id}</p>
                  </div>
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
                    <h3>Stock</h3>
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
                    <div className={styles.formButtonDiv}>
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
                    <Button
                      color="red"
                      size="compact-md"
                      radius="sm"
                      rightSection={<IconTrash size={20} />}
                      onClick={open}
                    >
                      Delete
                    </Button>
                    </div>
                  </div>
                </div>
              </form>
              <Modal
                opened={openedWarn}
                onClose={close}
                title=""
                withCloseButton={false}
              >
                <h3>Are you sure you want to delete this variant?</h3>
                <div className={styles.deleteButtonsDiv}>
                  <Button
                    color="yellow"
                    size="compact-sm"
                    radius="sm"
                    rightSection={<IconArrowBack size={20} />}
                    onClick={close}
                  >
                    Back
                  </Button>
                  <Button
                    color="red"
                    size="compact-sm"
                    radius="sm"
                    rightSection={<IconTrash size={20} />}
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </Button>
                </div>
              </Modal>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  );
};

export default VariantRows;
