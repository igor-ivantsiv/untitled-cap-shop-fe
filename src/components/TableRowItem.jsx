import { useDisclosure } from "@mantine/hooks";
import {
  Table,
  Button,
  Group,
  Text,
  Collapse,
  Box,
  Image,
  Modal,
  Input,
  NativeSelect,
  CloseButton,
} from "@mantine/core";
import {
  IconArrowBack,
  IconCross,
  IconPackageExport,
  IconPackageOff,
  IconTrash,
} from "@tabler/icons-react";
import { useContext, useState } from "react";
import { Form, useForm } from "@mantine/form";
import { SessionContext } from "../contexts/SessionContext"
import { useRefetchContext } from "../contexts/RefetchContext";

const TableRowItem = ({ order }) => {
    const { fetchWithToken } = useContext(SessionContext)
    const { setShouldRefetch } = useRefetchContext();

  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const shipForm = useForm({
    initialValues: { trackingId: "" },
  });
  const cancelForm = useForm({
    initialValues: { cancellationReason: "" },
  });

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

  const handleCancelSubmit = async (values, orderId) => {
    try {
      
      const updatedOrder = await fetchWithToken(
        `/orders/cancellation/${orderId}`,
        "PUT",
        { "cancellationReason": `${values.cancellationReason}` }
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
        <Table.Td>{order._id}</Table.Td>
        <Table.Td>{order.status}</Table.Td>
        <Table.Td>{`${order.firstName} ${order.lastName}`}</Table.Td>
        <Table.Td>$ {(order.totalSalesPrice / 100).toFixed(2)}</Table.Td>
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
        <Table.Td>
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
        <Table.Td>{order.trackingId ? order.trackingId : "-"}</Table.Td>
        <Table.Td>
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
        <Table.Td>
          {order.cancellationReason ? order.cancellationReason : "-"}
        </Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td colSpan={9}>
          <Collapse
            in={opened}
            transitionDuration={300}
            transitionTimingFunction="linear"
          >
            <div style={{ display: "flex" }}>
              <div>
                <p>User ID: {order.userId}</p>
                <p>
                  Address: {order.streetHouseNumber}, {order.city},{" "}
                  {order.zipCode}
                </p>
                <Button
                  color="blue"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconPackageExport size={20} />}
                  onClick={() => setShipModalOpen(true)}
                >
                  Ship
                </Button>
                <Modal
                  title="Ship order"
                  opened={shipModalOpen}
                  onClose={toggleShipModal}
                >
                  <form onSubmit={shipForm.onSubmit((values)=> handleShipSubmit(values, order._id))}>
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
                  </form>
                </Modal>
                <Button
                  color="orange"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconPackageOff size={20} />}
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel
                </Button>
                <Modal
                  title="Cancel order"
                  opened={cancelModalOpen}
                  onClose={toggleCancelModal}
                >
                  <form onSubmit={cancelForm.onSubmit((values)=> handleCancelSubmit(values, order._id))}>
                    <NativeSelect
                      {...cancelForm.getInputProps('cancellationReason')}
                      data={[
                        { label: "Select a cancellation reason", value: null },
                        { label: "Stock Problem", value: "stock problem" },
                        { label: "Customer Request", value: "customer request" },
                      ]}
                      mt="md"
                    />
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
                  </form>
                </Modal>
              </div>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Image</Table.Th>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Variant</Table.Th>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Color</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Sales Price</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {order.items.map((item) => (
                    <Table.Tr key={`${item.variantId._id}ItemsRow`}>
                      <Table.Td>
                        <Image
                          src={item.variantId.imageUrl}
                          height={50}
                          alt="product"
                        />
                      </Table.Td>
                      <Table.Td>{item.productId.name}</Table.Td>
                      <Table.Td>{item.variantId._id}</Table.Td>
                      <Table.Td>{item.variantId.size}</Table.Td>
                      <Table.Td>{item.variantId.color}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        $ {((item.quantity * item.salesPrice) / 100).toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Th colSpan={5}></Table.Th>
                    <Table.Th>Total price</Table.Th>
                    <Table.Th>
                      $ {(order.totalSalesPrice / 100).toFixed(2)}
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
