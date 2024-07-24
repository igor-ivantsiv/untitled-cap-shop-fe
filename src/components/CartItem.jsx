import {
  Button,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

const CartItem = ({ product }) => {
  return (
    <Grid align="flex-start" justify="center">
      <Grid.Col span={3}>
        <Image src={product.imageUrl} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Text>{product.productId.name}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Group>
          <Text fw={500} size="sm">
            {product.quantity}
          </Text>
          <Button.Group orientation="vertical">
            <Button
              loading={buttonsLoading}
              loaderProps={{ type: "dots" }}
              size="compact-xs"
              variant="outline"
              onClick={() => changeQuantity(product._id, true)}
            >
              <IconArrowUp />
            </Button>
            <Button
              loading={buttonsLoading}
              loaderProps={{ type: "dots" }}
              size="compact-xs"
              variant="outline"
              onClick={() => changeQuantity(product._id, false)}
            >
              <IconArrowDown />
            </Button>
          </Button.Group>
        </Group>
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberFormatter
          prefix="$"
          value={(product.price / 100) * product.quantity}
          decimalScale={2}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <Button
          size="compact-xs"
          onClick={() => removeproduct(product._id, product.quantity)}
        >
          X
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default CartItem