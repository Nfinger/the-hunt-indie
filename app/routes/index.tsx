import React from "react";
import type { LoaderFunction } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";

import { Button, Flex, Input, Text, HStack } from "@chakra-ui/react";
import Webcam from "react-webcam";

import { getProgress, updateProgress } from "~/models/progress.server";
import {
  getLocations,
  updateHasVisited,
  updateCorrectGuess,
} from "~/models/location.server";
import { QrCode } from "~/components/qrCode";
import { Steps } from "~/components/Steps";
import { Location } from "@prisma/client";

type LoaderData = {
  progress: Awaited<ReturnType<typeof getProgress>>;
  locations: Awaited<ReturnType<typeof getLocations>>;
};

type ActionData = {
  correct: boolean;
  index?: number;
};

const getQRPosition = (index: number) => {
  let position = "";
  switch (index) {
    case 0:
      position = "top-left";
      break;
    case 1:
      position = "top-right";
      break;
    case 2:
      position = "bottom-left";
      break;
    case 3:
      position = "bottom-right";
      break;
    default:
      position = "top-left";
      break;
  }
  return position;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const locationId = formData.get("locationId");
  const guess = formData.get("guess");
  const location = formData.get("location");
  const index = formData.get("index");
  const photo = formData.get("photo");
  const hasBeenVisited = formData.get("hasBeenVisited");

  if (hasBeenVisited) {
    await updateHasVisited(locationId as string);
    await updateProgress();
    return json<ActionData>({
      correct: true,
      index: parseInt(index as string) + 1,
    });
  } else {
    const correct =
      guess?.toString().toLowerCase() === location?.toString().toLowerCase();

    if (correct) {
      await updateCorrectGuess(locationId as string);
    }
    return json<ActionData>({ correct });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const progress = await getProgress();
  const locations = await getLocations();
  return json<LoaderData>({ progress, locations });
};

export default function Index() {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;
  const transition = useTransition();

  const { locations, progress } = data;

  const [activeIndex, setActiveIndex] = React.useState(
    progress?.currentStep ?? 0
  );
  const [locationPhoto, setLocationPhoto] = React.useState("");
  const ref = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (transition.state == "submitting") {
      ref.current && ref.current.reset();
    }
    if (actionData?.index) {
      setActiveIndex(actionData.index);
    }
  }, [transition]);

  if (!progress || !locations) return null;
  const handleClick = (index: number) => {
    const currentStep = progress?.currentStep ?? 0;
    if (index <= currentStep) {
      setActiveIndex(index);
    }
  };

  const videoConstraints = {
    facingMode: "user",
  };

  const buildContent = (location: Location) => {
    const { id, clue, name, boldWord, hasBeenGuessed } = location;

    let content = (
      <>
        <Text textStyle="body24" textAlign="center">
          {clue.split(" ").map((word) =>
            word === boldWord ? (
              <Text as="span" textStyle="bold" color="#d6ae7c">
                {word}{" "}
              </Text>
            ) : (
              `${word} `
            )
          )}
        </Text>
        <Form method="post" ref={ref}>
          <input
            type="text"
            id="locationId"
            name="locationId"
            value={id}
            readOnly
            hidden
          />
          <input
            type="text"
            id="location"
            name="location"
            value={name}
            readOnly
            hidden
          />
          <Input
            my={4}
            id="guess"
            required
            isInvalid={actionData?.correct === false}
            errorBorderColor={actionData?.correct === false ? "crimson" : ""}
            autoFocus={true}
            name="guess"
          />
          {actionData?.correct === false && (
            <Text mb={4} textAlign="center" color="crimson">
              Guess again you fool!
            </Text>
          )}
          <Button
            mt="2"
            w="full"
            variant="ghost"
            type="submit"
            colorScheme={actionData?.correct === false ? "red" : ""}
          >
            Guess!
          </Button>
        </Form>
      </>
    );

    if (hasBeenGuessed) {
      content = locationPhoto ? (
        <Form method="post" ref={ref}>
          <img src={locationPhoto} />
          <input
            type="text"
            id="locationId"
            name="locationId"
            value={id}
            readOnly
            hidden
          />
          <input
            type="text"
            id="photo"
            name="photo"
            value={locationPhoto}
            readOnly
            hidden
          />
          <input
            type="text"
            id="hasBeenVisited"
            name="hasBeenVisited"
            value="true"
            readOnly
            hidden
          />
          <input
            type="text"
            id="index"
            name="index"
            value={activeIndex}
            readOnly
            hidden
          />
          <HStack spacing={10} justify="center" mt="4">
            <Button onClick={() => setLocationPhoto("")}>Retake?</Button>
            <Button type="submit">Continue</Button>
          </HStack>
        </Form>
      ) : (
        <>
          <Text textStyle="body24" textAlign="center">
            Congratulations! You've guessed the location!
          </Text>
          <Text textStyle="body24" textAlign="center">
            Take a photo of the location to remember your visit!
          </Text>
          <Webcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          >
            {({ getScreenshot }) => (
              <Button
                mt="4"
                onClick={() => {
                  const imageSrc = getScreenshot();
                  setLocationPhoto(imageSrc ?? "");
                }}
              >
                Capture photo
              </Button>
            )}
          </Webcam>
        </>
      );
    }
    return content;
  };

  return (
    <Flex flexDirection="column" justify="center" align="center">
      <QrCode position={getQRPosition(activeIndex)} />
      <Steps onClick={handleClick} currentStep={progress.currentStep} />
      {progress.currentStep < locations.length ? (
        buildContent(locations[activeIndex])
      ) : (
        <>
          <Text textStyle="body24" textAlign="center">
            Alright I concede!
          </Text>
          <Text textStyle="body24" textAlign="center">
            You win! I'm not a sore loser
          </Text>
          <br />
          <Text textStyle="body24" textAlign="center">
            I totally wouldn't do something petty like make you solve where were
            going to dinner...
          </Text>
          <br />
          <br />
          <Text textStyle="body24" textAlign="center">
            Yeah I would, I totally did.
          </Text>
        </>
      )}
    </Flex>
  );
}
// import { useEffect } from "react";
// import type { LoaderFunction } from "@remix-run/node";
// import { useNavigate } from "@remix-run/react";
// import Countdown from "react-countdown";
// import { Button } from "@chakra-ui/react";
// const { start } = require("~/components/animatedText");

// export const loader: LoaderFunction = async ({ request }) => {
//   return null;
// };

// export default function Landing() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     start();
//   }, []);

//   return (
//     <main>
//       <svg
//         className="circles"
//         width="100%"
//         height="100%"
//         viewBox="0 0 1400 1400"
//       >
//         <path
//           id="circle-1"
//           d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
//         />
//         <path
//           id="circle-2"
//           d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
//         />
//         <path
//           id="circle-3"
//           d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
//         />
//         <path
//           id="circle-4"
//           d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
//         />
//         <text className="circles__text circles__text--1">
//           <textPath
//             className="circles__text-path"
//             xlinkHref="#circle-1"
//             aria-label=""
//             textLength="2830"
//           >
//             t The Hunt&nbsp; 05/07&nbsp; The Hunt&nbsp; The Hunt&nbsp; The Hun
//           </textPath>
//         </text>
//         <text className="circles__text circles__text--2">
//           <textPath
//             className="circles__text-path"
//             xlinkHref="#circle-2"
//             aria-label=""
//             textLength="2001"
//           >
//             nt The Hunt&nbsp; The Hunt&nbsp; 05/07&nbsp; The Hu
//           </textPath>
//         </text>
//         <text className="circles__text circles__text--3">
//           <textPath
//             className="circles__text-path"
//             xlinkHref="#circle-3"
//             aria-label=""
//             textLength="1341"
//           >
//             unt 05/07&nbsp; The Hunt&nbsp; The H
//           </textPath>
//         </text>
//         <text className="circles__text circles__text--4">
//           <textPath
//             className="circles__text-path"
//             xlinkHref="#circle-4"
//             aria-label=""
//             textLength="836"
//           >
//             Hunt The Hunt&nbsp; 05/07&nbsp; The
//           </textPath>
//         </text>
//       </svg>
//       {/* <div className="content"></div> */}
//       <Button
//         bg="#d6ae7c"
//         color="#000"
//         borderRadius={99}
//         height="100px"
//         width="100px"
//       >
//         <Countdown className="enter__text" date="2022-05-07T17:00:00" />
//         {/* <span className="enter__text">Enter</span> */}
//       </Button>
//     </main>
//   );
// }
