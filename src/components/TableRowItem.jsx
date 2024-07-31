import { useDisclosure } from "@mantine/hooks";
import {
  Table,
  Button,
  Collapse,
  Image,
  Modal,
  Input,
  NativeSelect,
  CloseButton,
} from "@mantine/core";
import { IconPackageExport, IconPackageOff } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { SessionContext } from "../contexts/SessionContext";
import { useRefetchContext } from "../contexts/RefetchContext";
import styles from "../styles/Dashboard.module.css";

const TableRowItem = ({ order }) => {
  const { fetchWithToken } = useContext(SessionContext);
  const { setShouldRefetch } = useRefetchContext();

  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const shipForm = useForm({
    initialValues: { trackingId: "" },
  });
  const cancelForm = useForm({
    initialValues: { cancellationReason: "" },
  });
  const [colSpan, setColSpan] = useState(5);

  const [opened, { toggle }] = useDisclosure(false);

  const toggleShipModal = () => {
    setShipModalOpen(!shipModalOpen);
  };

  const toggleCancelModal = () => {
    setCancelModalOpen(!cancelModalOpen);
  };

  const handleShipSubmit = async (values, orderId) => {
    try {
      const updatedOrder = await fetchWithToken(
        `/orders/shipment/${orderId}`,
        "PUT",
        { trackingId: values.trackingId } // Directly assigned without template string
      );

      console.log("Updated Order:", updatedOrder); // Debugging log
      setShipModalOpen(false);
      setShouldRefetch((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateColSpan = () => {
      if (window.innerWidth < 768) {
        setColSpan(3); 
      } else {
        setColSpan(5); 
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

  const handleCancelSubmit = async (values, orderId) => {
    try {
      const updatedOrder = await fetchWithToken(
        `/orders/cancellation/${orderId}`,
        "PUT",
        { cancellationReason: `${values.cancellationReason}` }
      );
      console.log(updatedOrder);
      setCancelModalOpen(false);
      setShouldRefetch((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Table.Tr onClick={toggle}>
        <Table.Td
          className={`${styles.truncatedColumn} ${styles.orderRowFormatting}`}
        >
          {order._id}
        </Table.Td>
        <Table.Td className={styles.orderRowFormatting}>
          <div
            className={`${styles.pill} ${styles.orderRowFormatting}`}
            style={{
              backgroundColor:
                order.status === "received"
                  ? "#7950F1"
                  : order.status === "shipped"
                  ? "#228BE6"
                  : order.status === "cancelled"
                  ? "#FD7E14"
                  : order.status === "payment error"
                  ? "#FA5252"
                  : "#868E96",
            }}
          >
            {order.status}
          </div>
        </Table.Td>
        <Table.Td className={styles.orderRowFormatting}>{`${order.firstName} ${order.lastName}`}</Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          $ {(order.totalSalesPrice / 100).toFixed(2)}
        </Table.Td>
        <Table.Td>
          {order.createdAt
            ? new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(order.createdAt))
            : "-"}
        </Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          {order.shippedAt
            ? new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(order.shippedAt))
            : "-"}
        </Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          {order.trackingId ? order.trackingId : "-"}
        </Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          {order.cancelledAt
            ? new Intl.DateTimeFormat("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(order.cancelledAt))
            : "-"}
        </Table.Td>
        <Table.Td className={styles.hideOnMobile}>
          {order.cancellationReason ? order.cancellationReason : "-"}
        </Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td colSpan={9} className={styles.expandableRow}>
          <Collapse
            in={opened}
            transitionDuration={300}
            transitionTimingFunction="linear"
          >
            <div className={styles.expandableOrdersContentDiv}>
              <div>
              <div className={styles.flexOnlyDiv}>
                    <h3>Cusomter</h3>
                    <p className={styles.idStyle}>{order.userId}</p>
                  </div>
                <p>
                <span className={styles.dataLabel}>Address:</span> {order.streetHouseNumber}, {order.city},
                  {order.zipCode}
                </p>
                <div className={styles.manageOrderButtons}>
                <Button
                  color="blue"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconPackageExport size={20} />}
                  onClick={() => setShipModalOpen(true)}
                >
                  Ship
                </Button>
                <Button
                  color="orange"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconPackageOff size={20} />}
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel
                </Button>
                </div>
                <Modal
                  title="Ship order"
                  opened={shipModalOpen}
                  onClose={toggleShipModal}
                  classNames={{
                    title: `${styles.formTitle}`,
                  }}
                >
                  <form
                    onSubmit={shipForm.onSubmit((values) =>
                      handleShipSubmit(values, order._id)
                    )}
                  >
                    <Input
                      placeholder="Tracking Id"
                      {...shipForm.getInputProps("trackingId")}
                      rightSectionPointerEvents="all"
                      mt="md"
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() =>
                            shipForm.setFieldValue("trackingId", "")
                          }
                          style={{
                            display: shipForm.values.trackingId
                              ? undefined
                              : "none",
                          }}
                        />
                      }
                    />
                    <div className={styles.shipOrderButtons}>
                    <Button
                      type="submit"
                      color="blue"
                      size="compact-md"
                      radius="sm"
                      rightSection={<IconPackageExport size={20} />}
                    >
                      Confirm
                    </Button>
                    <Button
                      color="yellow"
                      size="compact-md"
                      radius="sm"
                      onClick={() => setShipModalOpen(false)}
                    >
                      Back
                    </Button>
                    </div>
                  </form>
                </Modal>
                <Modal
                  title="Cancel order"
                  opened={cancelModalOpen}
                  onClose={toggleCancelModal}
                  classNames={{
                    title: `${styles.formTitle}`,
                  }}
                >
                  <form
                    onSubmit={cancelForm.onSubmit((values) =>
                      handleCancelSubmit(values, order._id)
                    )}
                  >
                    <NativeSelect
                      {...cancelForm.getInputProps("cancellationReason")}
                      data={[
                        { label: "Select a cancellation reason", value: null },
                        { label: "Stock Problem", value: "stock problem" },
                        {
                          label: "Customer Request",
                          value: "customer request",
                        },
                      ]}
                      mt="md"
                    />
                    <div className={styles.cancelOrderButtons}>
                    <Button
                      type="submit"
                      color="orange"
                      size="compact-md"
                      radius="sm"
                      rightSection={<IconPackageOff size={20} />}
                    >
                      Confirm
                    </Button>
                    <Button
                      color="yellow"
                      size="compact-md"
                      radius="sm"
                      onClick={() => setCancelModalOpen(false)}
                    >
                      Back
                    </Button>
                    </div>
                  </form>
                </Modal>
              </div>
              <Table         withTableBorder 
        verticalSpacing="sm"
        className={`${styles.tableContentStyles} ${styles.itemsTable}`}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className={styles.tableHeaders}>Image</Table.Th>
                    <Table.Th className={styles.tableHeaders}>Product</Table.Th>
                    <Table.Th className={`${styles.hideOnMobile} ${styles.tableHeaders}`}>Variant</Table.Th>
                    <Table.Th className={`${styles.hideOnMobile} ${styles.tableHeaders}`}>Size</Table.Th>
                    <Table.Th className={styles.tableHeaders}>Color</Table.Th>
                    <Table.Th className={styles.tableHeaders}>Quantity</Table.Th>
                    <Table.Th className={styles.tableHeaders}>Price</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody >
                  {order.items.map((item) => (
                    <Table.Tr key={`${item.variantId._id}ItemsRow`}>
                      <Table.Td  className={styles.orderRowFormatting}>
                        <Image
                          src={item.variantId.imageUrl}
                          height={50}
                          alt="product"
                        />
                      </Table.Td>
                      <Table.Td  className={styles.orderRowFormatting}>{item.productId.name}</Table.Td>
                      <Table.Td className={styles.hideOnMobile}>{item.variantId._id}</Table.Td>
                      <Table.Td className={styles.hideOnMobile}>{item.variantId.size}</Table.Td>
                      <Table.Td  className={styles.orderRowFormatting}>{item.variantId.color}</Table.Td>
                      <Table.Td  className={styles.orderRowFormatting}>{item.quantity}</Table.Td>
                      <Table.Td  className={styles.orderRowFormatting}>
                        ${((item.quantity * item.salesPrice) / 100).toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th colSpan={colSpan}></Table.Th>
                    <Table.Th  className={`${styles.orderRowFormatting} ${styles.tableHeaders}`}>Total</Table.Th>
                    <Table.Th  className={`${styles.orderRowFormatting} ${styles.tableHeaders}`}>
                      ${(order.totalSalesPrice / 100).toFixed(2)}
                    </Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </div>
          </Collapse>
        </Table.Td>
      </Table.Tr>
    </>
  );
};

export default TableRowItem;
