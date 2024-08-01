
import { AspectRatio, Button } from "@mantine/core";
import hero from "../hero.webp"
import styles from "../styles/Homepage.module.css"
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
<div className={styles.hero}>
<AspectRatio ratio={643 / 360} mx="auto">
      <img src={hero} alt="Hero" className={styles.heroImage} />
      </AspectRatio>
      <div className={styles.heroTitleDiv}>
        <p className={styles.heroTitle}>Untitled. Caps</p>
        </div>
        <Link to="/products" >
        <Button
      variant="gradient"
      gradient={{ from: 'blue', to: 'gray', deg: 0 }}
      size="compact-xl"
      className={styles.heroButton}
    >
      SHOP NOW
    </Button>
    </Link>
    </div>
    <section className={styles.contentSection}>
      <h3>Baseball Caps: A Sporting Icon</h3>
      <p>Baseball caps have their origins in sports, specifically baseball in the late 1800s. Originally designed to protect players' eyes from the sun, they have evolved into a ubiquitous fashion item.</p>
      <p>Untitled. Caps are revolutionizing the world of headwear by introducing high-performance baseball caps that are both stylish and functional.</p>
      <img className={styles.contentImage} src="https://cdn.shopify.com/s/files/1/0754/9295/0356/files/mattgrey_480x480.webp?v=1698516008" alt="baseball" />
    </section>
    <section className={styles.contentSection}>
      <h3>Snapback Caps: The symbol of streetwear</h3>
      <p>In the late 80s and early 90s, the connection between snapback caps and hip-hop culture solidified. They became a symbol of belonging and individual expression within this musical movement.</p>
      <p>Snapback cap designs range from minimalist approaches to bold, graphic representations. They often reflect the creative roots of urban culture and are a preferred accessory for artists and cultural workers.</p>
      <img src="https://www.schwerelosigkite.de/media/image/product/13555/md/snapback-cap-holzkopf-ocker.jpg" alt="snapback" />
    </section>
    <section className={styles.contentSection}>
      <h3>Snapback Caps: The symbol of streetwear</h3>
      <p>Trucker caps, originally designed as promotional gifts for truck drivers and farmers, have their roots in rural America. Their practical nature, especially the mesh back for better ventilation, made them popular with workers.</p>
      <p>With their half-high crown and curved visor, trucker caps were brought into the mainstream by celebrities and the media. They are now a staple of pop culture and are worn by people of all ages.</p>
      <img src="https://copperandbrass.de/wp-content/uploads/2021/03/Flexfit-Trucker-Cap-Multicam-Black-Cap-Military-Tarnmuster-Shop.jpg" alt="caps" />
    </section>
    <section className={`${styles.contentSection} ${styles.lastSection}`}>
      <h2 className={styles.lastHeader}>Which Style is yours?</h2>
      <Link to="/products" >
        <Button
      variant="gradient"
      gradient={{ from: 'blue', to: 'gray', deg: 0 }}
      size="compact-xl"
    >
      SHOP NOW
    </Button>
    </Link>
    </section>
    </>
  );
};

export default Homepage;
