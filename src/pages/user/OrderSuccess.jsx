import { IconCircleCheck } from "@tabler/icons-react";
import styles from "../../styles/Checkout.module.css"
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <>
      <section className={styles.successSection}>
        <h1 className={styles.successHeader}>You order has been placed</h1>
        <p className={styles.successText}>The payment is still being processed. Once the payment has been processed, you will receive an order confirmation email.</p>
        <div className={styles.successIconDiv}>
        <IconCircleCheck size="96" />
        </div>
        <div className={styles.successButtonDiv}>
        <Link to="/" >
        <Button
      variant="gradient"
      gradient={{ from: 'blue', to: 'gray', deg: 0 }}
      size="compact-xl"
    >
     TO HOMEPAGE
    </Button>
    </Link>
    </div>
      </section>
    </>
  );
};

export default OrderSuccess;
