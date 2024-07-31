import { Accordion, Center } from "@mantine/core";
import { IconCloudRain, IconStar, IconTruck } from "@tabler/icons-react";
import classes from "../styles/ProductDetails.module.css"

const DetailsAccordion = () => {
  const details = [
    {
      icon: <IconCloudRain />,
      title: "Water Resistant",
      description:
        "Keep your head dry, even in the rain: Our cap is specially designed to repel water. Thanks to the advanced coating, rain simply rolls off without penetrating the fabric. This means you stay comfortably dry even in unexpected showers. Ideal for all outdoor activities, this cap offers reliable protection against moisture without sacrificing style.",
    },
    {
      icon: <IconTruck />,
      title: "Free Shipping",
      description:
        "We offer free shipping on all products. Orders received before 3pm will be dispatched the same day. We guarantee fast delivery within Germany, so your item will usually arrive at your home within 1 to 2 working days. We also offer a 30-day, hassle-free return guarantee, no questions asked.",
    },
    {
      icon: <IconStar />,
      title: "Features",
      description:
        "This cap is adjustable to any head size and offers a stylish and comfortable fit. This is your reliable everyday cap, a loyal companion with a sporty touch. Featuring a modern minimalist design and no big logos to ruin the image.",
    },
  ];

  const accordionContent = details.map((item) => (
    <Accordion.Item key={item.title} value={item.title}>
      <Accordion.Control icon={item.icon}>{item.title}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));
  return <>
  <Center className={classes.container}>
  <Accordion w={{base: "100%" ,md: 800}}>
    {accordionContent}
  </Accordion>
  </Center>
  </>;
};

export default DetailsAccordion;
