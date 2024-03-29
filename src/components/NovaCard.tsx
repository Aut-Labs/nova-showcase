import { Box, Button, Link, Typography, styled } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import Flipcard from "@components/Flipcard";
import FlipIcon from "@assets/flip.svg";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { ApplyOrWithdrawFromQuest } from "./ApplyOrWithdrawFromQuest";
import { NovaDAO } from "@api/community.model";

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

export const NovaCard = ({
  daoData,
  highlightData,
  onQuestSelected,
  onApplyForQuest,
  questToApplyFor,
  isApplying
}: {
  daoData: NovaDAO;
  highlightData: any;
  onQuestSelected: any;
  onApplyForQuest: any;
  questToApplyFor: any;
  isApplying: boolean;
}) => {
  const [isFlipped, setFlipped] = useState(false);
  const [hasTimePassed, setHasTimePassed] = useState(false);

  const questStartTime = useMemo(() => {
    return new Date(
      daoData?.properties?.quests.find(
        (q) => q.questId === highlightData?.questId
      )?.startDate
    );
  }, [highlightData, daoData, hasTimePassed]);

  useEffect(() => {
    if (highlightData.highlighted && questStartTime > new Date()) {
      const timeDifference = questStartTime.getTime() - new Date().getTime();

      const buttonTimeout = setTimeout(() => {
        setHasTimePassed(true);
      }, timeDifference);

      return () => {
        clearTimeout(buttonTimeout);
      };
    }
  }, []);

  const questDetails = async (e, quest) => {
    e.stopPropagation();
    onQuestSelected({
      ...quest,
      onboardingQuestAddress: daoData.onboardingQuestAddress,
      daoAddress: daoData.daoAddress
    });
  };

  const flipCard = () => {
    if (isFlipped) {
      setFlipped(false);
    } else {
      setFlipped(true);
    }
  };

  const goToQuest = (e) => {
    e.stopPropagation();
    const quest = daoData.properties.quests.find(
      (q) => q.questId === highlightData.questId
    );
    onQuestSelected({
      ...quest,
      onboardingQuestAddress: daoData.onboardingQuestAddress,
      daoAddress: daoData.daoAddress
    });
  };

  return (
    <div
      style={{
        marginBottom: "65px"
      }}
    >
      <Flipcard
        isFlipped={isFlipped}
        onClick={flipCard}
        containerClassName={`${isFlipped ? "flipped" : ""}`}
      >
        <AutCardFront
          className={`aut-card-front ${isFlipped ? "flipped" : ""}`}
        >
          <AutCardContainer
            className={`aut-card-container front ${
              highlightData.highlighted && "highlighted"
            }`}
          >
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
              fontWeight="normal"
              textAlign="center"
              fontFamily="FractulRegular"
              variant="body"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.description}
            </Typography>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
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
          <AutCardContainer
            className={`aut-card-container back ${
              highlightData.highlighted && "highlighted"
            }`}
          >
            <Typography
              fontWeight="bold"
              textAlign="center"
              fontFamily="FractulAltBold"
              variant="subtitle1"
              sx={{
                mt: "25px",
                mb: "0px",
                color: "white"
              }}
            >
              Pick your Role
            </Typography>
            <Typography
              fontWeight="normal"
              textAlign="center"
              fontFamily="FractulRegular"
              variant="subtitle2"
              sx={{
                mt: "5px",
                mb: "0px",
                color: "white"
              }}
            >
              {daoData.name}
            </Typography>
            <Box
              marginTop={{ _: "20px", md: "10px", lg: "13px", xl: "20px" }}
              width="100%"
            >
              {daoData.properties.quests.map((quest, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      marginTop: "22px",
                      padding: "0px 17px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start"
                      }}
                    >
                      <Typography
                        fontWeight="normal"
                        textAlign="center"
                        fontFamily="FractulRegular"
                        variant="body"
                        sx={{
                          textAlign: "start",
                          mt: "5px",
                          mb: "0px",
                          color: "white"
                        }}
                      >
                        {getRoleName(daoData, quest)}
                      </Typography>
                      {quest.active ? (
                        <Link
                          sx={{
                            textAlign: "start"
                          }}
                          component="button"
                          color="offWhite.main"
                          variant="caption"
                          onClick={(e) => questDetails(e, quest)}
                        >
                          Details
                        </Link>
                      ) : (
                        <Typography color="offWhite.main" variant="caption">
                          Inactive
                        </Typography>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "105px"
                      }}
                    >
                      <ApplyOrWithdrawFromQuest
                        daoData={daoData}
                        quest={quest}
                        onApplyForQuest={onApplyForQuest}
                        questToApplyFor={questToApplyFor}
                        isApplying={isApplying}
                      ></ApplyOrWithdrawFromQuest>
                    </div>

                    {/* <Button
                      onClick={(e) => applyForQuest(e, quest)}
                      disabled={isApplying || isQuestDisabled(quest.questId)}
                      sx={{
                        color: "white",
                        padding: "0px",
                        fontSize: "12px",
                        height: "38px",
                        width: "94px",
                        borderWidth: "2px",
                        whiteSpace: "nowrap",
                        textAlign: "center"
                      }}
                      color="offWhite"
                      variant="square"
                    >
                      {isActiveQuest(quest.questId) ? "Withdraw" : "Apply"}
                    </Button> */}
                  </div>
                );
              })}
            </Box>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
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
      {highlightData.highlighted && highlightData.questId ? (
        questStartTime > new Date() ? (
          <Countdown>
            <Typography
              width="100%"
              textAlign="center"
              variant="subtitle2"
              mb={1}
              className="text-secondary"
            >
              Quest starts in...
            </Typography>
            <FlipClockCountdown
              digitBlockStyle={{
                fontFamily: "FractulRegular",
                width: "26px",
                height: "40px",
                fontSize: "38px"
              }}
              labelStyle={{
                fontSize: "12px",
                fontFamily: "FractulRegular"
              }}
              separatorStyle={{
                size: "4px"
              }}
              // next line should have a date thats 10 minutes from now
              to={questStartTime}
            />
          </Countdown>
        ) : (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
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
              onClick={goToQuest}
            >
              GO TO QUEST
            </SeeQuestButton>
          </div>
        )
      ) : (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
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
            onClick={flipCard}
          >
            SEE QUESTS
          </SeeQuestButton>
        </div>
      )}
    </div>
  );
};

export default memo(NovaCard);
