import { PromoHeader } from "components/PromoHeader";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header as SHeader,
  Image,
  Message,
  Modal,
  Segment,
  TextArea,
} from "semantic-ui-react";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";
import router, { useRouter } from "next/router";
import { useAuth } from "utils/useAuth";
import { api } from "utils/api";
import { ArrangeEventDto } from "@common/dto/arrange-event.dto";
import { CreateUserDto } from "@common/dto/create-user.dto";
import { AxiosError } from "@common/node_modules/axios";
import { MessageContext } from "utils/MessageContext";
import { ErrorDto } from "@common/dto/error.dto";

function Promo() {
  const { t } = useTranslation();
  return (
    <Form
      style={{
        height: "600px",
        background:
          "#000 url(https://motionarray.imgix.net/preview-400914-6SoVGPExfQJ2chbx-large.jpg?w=1400&q=60&fit=max&auto=format) center no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Container style={{ display: "flex", height: "100%" }}>
        <div style={{ width: "50%", flexShrink: 0 }}></div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <section
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(15px)",
              borderRadius: "10px",
              padding: "2rem",
            }}
          >
            <h2>{t("pages.index.title")}</h2>
            <p style={{ fontSize: "13pt" }}>{t("pages.index.subtitle")}</p>
            <EventArrange />
          </section>
        </div>
      </Container>
    </Form>
  );
}

function EventArrange() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [auth] = useAuth();
  const { setValue: setMessage } = useContext(MessageContext);

  const handleSubmit = async () => {
    if (!auth?.access_token) {
      try {
        const {
          data: { access_token },
        } = await api.post<{ access_token: string }>("/auth/register", {
          email,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          password,
        } as CreateUserDto);

        const timespan_end = new Date();
        timespan_end.setDate(timespan_end.getDate() + 1);
        timespan_end.setHours(0, 0, 0);
        await api.post(
          "/events/request",
          {
            description,
            additional_ids: [auth.user.id],
            timespan_start: new Date().toISOString(),
            timespan_end: timespan_end.toISOString(),
          } as ArrangeEventDto,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setMessage(
          "Your meeting request was created. In order for it to be accepted, you need to <b>verify your email address</b> using the link we sent you."
        );
        setOpen(false);
      } catch (e) {
        console.log(e);
        setMessage("Error: " + (e as ErrorDto).message);
      }
    }
  };
  const createRequest = async () => {
    // TODO: choose time?
    const timespan_end = new Date();
    timespan_end.setDate(timespan_end.getDate() + 1);
    timespan_end.setHours(0, 0, 0);
    try {
      await api.post("/events/request", {
        description,
        additional_ids: [auth.user.id],
        timespan_start: new Date().toISOString(),
        timespan_end: timespan_end.toISOString(),
      } as ArrangeEventDto);
      setMessage(
        "Your meeting request was created. You are now being redirect to the meetings page."
      );
      router.push("/meetings");
    } catch (e) {}
  };

  return (
    <>
      <TextArea
        style={{ resize: "none" }}
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      ></TextArea>
      <div style={{ textAlign: "right", marginTop: "1rem" }}>
        <Button
          primary
          onClick={() => {
            if (auth?.access_token) createRequest();
            else setOpen(true);
          }}
        >
          {t("pages.index.arrange_event")}
        </Button>
      </div>
      <Modal size={"small"} open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Arrange a meeting</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>First name:</label>
              <input
                placeholder="John"
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                value={firstName}
              />
            </Form.Field>
            <Form.Field>
              <label>Middle name:</label>
              <input
                onChange={(e) => setMiddleName(e.target.value)}
                value={middleName}
              />
            </Form.Field>
            <Form.Field>
              <label>Last name:</label>
              <input
                placeholder="Smith"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </Form.Field>
            <Form.Field>
              <label>E-mail:</label>
              <input
                placeholder="example@example.org"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
              />
            </Form.Field>
            <Form.Field>
              <label>Password:</label>
              <input
                placeholder=""
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Field>
            <Form.Field>
              <label>Description:</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </Form.Field>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={(e) => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button primary type="submit">
                Send
              </Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
}

function PromoAdvantages() {
  const { t } = useTranslation();
  return (
    <Segment id="advantages" style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <SHeader as="h3" style={{ fontSize: "2em" }}>
              {t("pages.index.promo_title1")}
            </SHeader>
            <p style={{ fontSize: "1.33em" }}>
              {t("pages.index.promo_content1")}
            </p>
            <SHeader as="h3" style={{ fontSize: "2em" }}>
              {t("pages.index.promo_title2")}
            </SHeader>
            <p style={{ fontSize: "1.33em" }}>
              {t("pages.index.promo_content2")}
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image size="medium" src="/assets/lawyer.png" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Button size="huge">{t("pages.index.arrange_event")}</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

function Lawyers() {
  return (
    <Container id="lawyers">
      <h1 style={{ marginTop: "20px" }}>Our lawyers</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "23% 23% 23% 23%",
          gridAutoRows: "auto",
          gap: "30px",
          width: "100%",
        }}
      >
        <Card
          image="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Lawyer"
          style={{ margin: 0 }}
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
        <Card
          image="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Lawyer"
          style={{ margin: 0 }}
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
        <Card
          image="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Lawyer"
          style={{ margin: 0 }}
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
        <Card
          image="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Lawyer"
          style={{ margin: 0 }}
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
      </div>
    </Container>
  );
}

export default function Home() {
  const router = useRouter();
  const { verify } = router.query;
  const { setValue: setMessage } = useContext(MessageContext);

  useEffect(() => {
    if (verify == "success") {
      setMessage("Your account was verified.");
    } else if (verify) {
      setMessage("There was an error verifying your account.");
    }
  }, [verify]);

  return (
    <section>
      <Header />
      <PromoHeader />
      <Promo />
      <PromoAdvantages />
      <Lawyers />
    </section>
  );
}
