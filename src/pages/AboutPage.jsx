import { Divider, List, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconAlien, IconCircleCheck } from "@tabler/icons-react";
import styles from "../styles/AboutPage.module.css"

const AboutPage = () => {
  return (
    <>
      <h1>About us</h1>
      <div>

        <Paper p="xl" shadow="lg" >
                  <h2 className={styles.mainContentHeader}>Untitled. Caps</h2>
                  <Divider my="md" variant="dashed" />

          <Text c="dimmed">
           Caps are much more than just a means of protecting yourself from the sun or covering up bad hair days. They are a cultural symbol, an expression of loyalty to sports teams, music genres or simply a fashion accessory that underlines your own style. Untitled. Caps brings you the best of both worlds. Functionality and style.
          </Text>
        </Paper>
      </div>

      <div>
        <Paper p="xl" shadow="lg">
        <h2>Development team</h2>
        <Divider my="md" variant="dashed" />
        <div className={styles.developerTeamCardContent}>
          <div className={styles.developerTeamIconDiv}>
            <IconAlien size={50}/>
          </div>
          <div className={styles.developerTeamCardText}>
          <div>Igor Ivantsiv</div>
          <Text c="dimmed">
        Greetings! My name is Igor. I am 29 years old. I was born in Ukraine, grew up in Israel and England, studied Economics & Business in the Netherlands and then moved to Germany to work as a product manager. Towards the end of 2023 I decided to do a career change to become a software developer. Untitled. Caps is the final project of my Web Development bootcamp at Ironhack. My partner and I are excited to share this app with you. Enjoy!
          </Text>
          </div>
          </div>
        </Paper>
        <Paper p="xl" shadow="lg" className="about-team">
        <div className={styles.developerTeamCardContent}>
          <div className={styles.developerTeamIconDiv}>
            <IconAlien size={50}/>
          </div>
          <div>
          <div >Thomas Kruithof</div>
          <Text c="dimmed">
            Hi there! I'm Thomas, I'm 28 years old, born in the Netherlands and currently living in France.
            I'm on my way to becoming a full stack web developer, with the help of Ironhack bootcamp.
            This is my full-stack Web Development graduation project. It was a lot of fun. 
            I've learned much from it, and I hope to be making many more apps in the future.
            <br />I hope you enjoy our app!
          </Text>
          </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default AboutPage;
