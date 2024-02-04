import { Avatar, Box, Button, Link, Typography, styled } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { NovaDAO } from "@api/community.model";
import { useNavigate } from "react-router-dom";
import AutIconLabel from "./AutIconLabel";
import { ArchetypeIcons, Markets, NovaArchetype } from "@api/community.api";
import { ReactComponent as ArrowIcon } from "@assets/autos/move-right.svg";

const getRoleName = (daoData, quest) => {
  const role = daoData.properties.rolesSets[0].roles.find(
    (r) => r.id === quest.role
  );
  if (role) {
    return role.roleName;
  }
  return "N/A";
};

const AutCardFront = styled("div")({
  width: "100%",
  height: "100%",
  border: "1px"
});

const SeeQuestButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "330px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "380px"
  }
}));

const AutCardContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("sm")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("md")]: {
    width: "300px",
    height: "350px"
  },
  [theme.breakpoints.up("xl")]: {
    width: "330px",
    height: "380px"
  },
  [theme.breakpoints.up("xxl")]: {
    width: "380px",
    height: "430px"
  },
  boxShadow:
    "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)",
  // boxShadow: "10px 10px 10px black",
  backgroundColor: "#262626",
  borderColor: "#3f3f40",
  borderStyle: "solid",
  borderWidth: "3px",
  padding: "0px 5px",
  overflow: "hidden",
  borderRadius: "16px",
  // borderTopLeftRadius: "16px",
  // borderTopRightRadius: "16px",
  // borderBottomLeftRadius: "0",
  // borderBottomRightRadius: "0",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  "&.highlighted": {
    boxShadow: "20px 20px 20px #0063a2"
  },
  transition: theme.transitions.create(["transform"]),
  "&:hover": {
    transform: "scale(1.019)"
  }
}));

const AutCardBack = styled("div")({
  height: "100%",
  width: "100%"
});

const Countdown = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginTop: "45px",
  justifyContent: "center",
  alignItems: "center",
  "& > DIV > DIV:nth-of-type(even)": {
    marginLeft: "4px",
    marginRight: "4px"
  },
  "& > DIV > DIV:nth-of-type(odd) > DIV:nth-of-type(2)": {
    marginRight: "2px"
  }
});

export const NovaCard = ({ daoData }: { daoData: any }) => {
  const navigate = useNavigate();
  const [isFlipped, setFlipped] = useState(false);
  const [hasTimePassed, setHasTimePassed] = useState(false);

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div
    // style={{
    //   marginBottom: "65px"
    // }}
    >
      <Flipcard
        isFlipped={isFlipped}
        onClick={flipCard}
        containerClassName={`${isFlipped ? "flipped" : ""}`}
      >
        <AutCardFront
          className={`aut-card-front ${isFlipped ? "flipped" : ""}`}
        >
          <AutCardContainer className={`aut-card-container front`}>
            {" "}
            <img
              src={ipfsCIDToHttpUrl(daoData?.image)}
              alt="Dao image"
              style={{
                marginTop: "15px",
                width: "100px",
                height: "100px"
              }}
            />
            <Typography
              fontWeight="bold"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <Box
              sx={{
                maxWidth: "600px",
                width: "60%",
                display: "flex",
                alignItems: "space-between",
                justifyContent: "space-between"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  {daoData.properties.prestige}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "4px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  Prestige
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "25px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  {daoData.properties.members}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontFamily="FractulAltBold"
                  variant="body"
                  sx={{
                    mt: "4px",
                    mb: "0px",
                    color: "white"
                  }}
                >
                  Members
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              marginTop="auto"
              width="80%"
              marginBottom="10px"
            >
              {daoData.properties.roles.map((role: any) => (
                <Button
                  key={role.id}
                  sx={{
                    flex: "1",
                    color: "white",
                    borderRadius: "24px",
                    border: "1px",
                    borderColor: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black"
                    }
                  }}
                >
                  {role.roleName}
                </Button>
              ))}
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardFront>
        <AutCardBack className="aut-card-back">
          <AutCardContainer className={`aut-card-container back`}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                marginTop: "24px",
                padding: "0px 34px"
              }}
            >
              <Avatar
                sx={{
                  height: {
                    xs: "60px",
                    md: "70px",
                    xxl: "70px"
                  },
                  borderRadius: "0",
                  width: {
                    xs: "60px",
                    md: "70px",
                    xxl: "70px"
                  },
                  bgcolor: "purple"
                }}
                aria-label="avatar"
                src={ipfsCIDToHttpUrl(daoData?.properties.image as string)}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Typography
                  color="offWhite.main"
                  textAlign="left"
                  lineHeight={1}
                  variant="h3"
                >
                  {daoData?.name}
                </Typography>
              </div>
            </Box>
            <Typography
              fontFamily="FractulRegular"
              variant="caption"
              sx={{
                mt: "25px",
                padding: "0px 24px",
                color: "white"
              }}
            >
              {daoData.properties.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "0px 14px",
                marginTop: "auto"
              }}
            >
              <AutIconLabel
                sx={{
                  flex: "1",
                  flexBasis: "50%"
                  // marginTop: theme.spacing(2)
                }}
                icon={<ArrowIcon />}
                label={Markets[daoData?.properties.archetype]}
              ></AutIconLabel>
              <AutIconLabel
                sx={{
                  flex: "1",
                  flexBasis: "50%"
                  // marginTop: theme.spacing(2)
                }}
                icon={
                  <img
                    src={ArchetypeIcons[daoData?.properties.archetype]}
                    width="22px"
                    height="22px"
                  />
                }
                label={NovaArchetype[daoData?.properties.archetype]}
              ></AutIconLabel>
            </Box>

            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <img
                style={{
                  width: "22px",
                  height: "22px",
                  marginRight: "10px"
                }}
                src={FlipIcon}
                alt="Flip icon"
              />
            </div>
          </AutCardContainer>
        </AutCardBack>
      </Flipcard>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <SeeQuestButton
          sx={{
            width: "100%",
            mt: "24px",
            boxShadow:
              "0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)"
          }}
          variant="outlined"
          size="normal"
          color="offWhite"
          onClick={() => {
            navigate(`/dao?daoAddress=${daoData.properties.address}`);
          }}
        >
          Join
        </SeeQuestButton>
      </div>
    </div>
  );
};

export default memo(NovaCard);
