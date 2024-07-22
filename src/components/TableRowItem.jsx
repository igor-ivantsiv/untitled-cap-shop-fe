import { useDisclosure } from "@mantine/hooks";
import {
  Table,
  Button,
  Group,
  Text,
  Collapse,
  Box,
  Image,
} from "@mantine/core";
import { IconCross, IconPackageExport, IconPackageOff, IconTrash } from "@tabler/icons-react";

const TableRowItem = ({ order }) => {

  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
<Table.Tr onClick={toggle}>
    <Table.Td>{order._id}</Table.Td>
    <Table.Td>{order.status}</Table.Td>
    <Table.Td>{`${order.firstName} ${order.lastName}`}</Table.Td>
    <Table.Td>$ {(order.totalSalesPrice/100).toFixed(2)}</Table.Td>
    <Table.Td>
        {order.shippedAt ? 
            new Intl.DateTimeFormat('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(order.shippedAt))
            : '-'
        }
    </Table.Td>
    <Table.Td>{order.trackingId ? order.trackingId : '-'}</Table.Td>
    <Table.Td>
        {order.cancelledAt ? 
            new Intl.DateTimeFormat('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(order.cancelledAt))
            : '-'
        }
    </Table.Td>
    <Table.Td>{order.cancellationReason ? order.cancellationReason : '-'}</Table.Td>
</Table.Tr>

      <Table.Tr>
        <Table.Td colSpan={8}>
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
              >
                Ship
              </Button>
              <Button
                color="orange"
                size="compact-md"
                radius="sm"
                rightSection={<IconPackageOff size={20} />}
              >
                Cancel
              </Button>
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
                    <Table.Tr>
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
                      <Table.Td>$ {(item.quantity * item.salesPrice/100).toFixed(2)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                <Table.Tr>
                <Table.Th colSpan={5}></Table.Th>
                <Table.Th>Total price</Table.Th>
                <Table.Th>$ {(order.totalSalesPrice/100).toFixed(2)}</Table.Th>
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
