import { Suspense, lazy, memo, useEffect, useMemo, useRef } from "react";
import AutLoading from "@components/AutLoading";
import {
  Avatar,
  Box,
  Link,
  Paper,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { useSelector } from "react-redux";
import CopyAddress from "@components/CopyAddress";
import { IsAuthorised } from "@store/WalletProvider/WalletProvider";
import CommunityInfo from "./CommunityInfo";

import backgroundImage from "@assets/autos/background.png";
import {
  ArchetypeIcons,
  Markets,
  NovaArchetype,
  useGetAllNovasQuery,
  useGetNovaTasksQuery
} from "@api/community.api";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { ReactComponent as DiscordIcon } from "@assets/SocialIcons/DiscordIcon.svg";
import { ReactComponent as GitHubIcon } from "@assets/SocialIcons/GitHubIcon.svg";
import { ReactComponent as LensfrensIcon } from "@assets/SocialIcons/LensfrensIcon.svg";
import { ReactComponent as TelegramIcon } from "@assets/SocialIcons/TelegramIcon.svg";
import { ReactComponent as TwitterIcon } from "@assets/SocialIcons/TwitterIcon.svg";
import { ReactComponent as WebsiteIcon } from "@assets/SocialIcons/WebsiteIcon.svg";
import { autUrls } from "@api/environment";
import { useAccount, useChainId } from "wagmi";
import { novaSocialUrls, socialUrls } from "@api/aut.model";
import theme from "@theme/theme";
import AutUserTabs from "./AutNovaTabs/AutUserTabs";
import { ReactComponent as ArrowIcon } from "@assets/autos/move-right.svg";
import moment from "moment";
import { AutButton, AutOsButton } from "@components/AutButton";
import AutIconLabel from "@components/AutIconLabel";
import AutValueLabel from "@components/AutValueLabel";

const socialIcons = {
  discord: DiscordIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  lensfrens: LensfrensIcon
};

const AutContainer = styled("div")(() => ({
  display: "flex",
  height: "100%"
  // backgroundImage: `url(${backgroundImage})`,
  // backgroundBlendMode: "hard-light",
  // backgroundSize: "cover",
  // backgroundRepeat: "repeat-y"
}));

const LeftWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "40%"
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  px: "30px",
  marginTop: "120px",
  marginRight: "25px",
  marginLeft: "25px",
  height: "100%",
  position: "relative",
  width: "60%"
}));

export const IconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "25px",
  height: "40px",

  flex: "1",
  flexBasis: "50%",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
    color: theme.palette.common.white,
    borderColor: "#576176",
    padding: theme.spacing(3),
    "&:nth-of-type(2)": {
      padding: `${theme.spacing(3)} 0 ${theme.spacing(3)} ${theme.spacing(3)}`
    },
    "&:nth-of-type(3)": {
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} 0`
    }
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const TableListItem = memo((data: any) => {
  const { row } = data;
  const theme = useTheme();
  return (
    <StyledTableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "td, th": {
          padding: theme.spacing(3),
          "&:nth-of-type(1)": {
            width: "50%"
          },
          "&:nth-of-type(2)": {
            width: "25%"
          },
          "&:nth-of-type(3)": {
            width: "25%"
          }
        }
      }}
    >
      <StyledTableCell align="left">
        <Stack>
          <Typography variant="subtitle1" fontWeight="normal" color="white">
            {row?.name}
          </Typography>
          <Typography variant="caption" fontWeight="normal" color="white">
            {row?.description}
          </Typography>
        </Stack>
      </StyledTableCell>
      <StyledTableCell>
        <Typography variant="subtitle1" fontWeight="normal" color="white">
          {row?.role}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body" fontWeight="normal" color="white">
          {moment(row?.endDate).format("DD.MM.YY • HH:mm").toString()}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
        <AutOsButton>
          <Typography variant="body" fontWeight="normal" color="white">
            Verify
          </Typography>
        </AutOsButton>
      </StyledTableCell>
    </StyledTableRow>
  );
});

export const CommunityTasksTable = ({ header, tasks }) => {
  const theme = useTheme();
  return (
    <div>
      <TableContainer
        sx={{
          minWidth: {
            sm: "100%"
          },
          width: {
            xs: "360px",
            sm: "unset"
          },
          margin: 0,
          my: theme.spacing(3),
          padding: 0,
          backgroundColor: "transparent",
          borderColor: "#576176"
        }}
        component={Paper}
      >
        <Table
          className="swiper-no-swiping"
          sx={{
            minWidth: {
              xs: "700px",
              sm: "unset"
            },
            ".MuiTableBody-root > .MuiTableRow-root:hover": {
              backgroundColor: "#ffffff0a"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Onboarding Task
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  Role
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Typography
                  variant="body"
                  fontWeight="normal"
                  color="offWhite.dark"
                >
                  End Date
                </Typography>
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.map((row, index) => (
              <TableListItem key={`table-row-${index}`} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const NovaDetails = () => {
  const theme = useTheme();
  const ps = useRef<HTMLElement>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();

  const { data: nova } = useGetAllNovasQuery(null, {
    selectFromResult: ({ data }) => ({
      data: (data?.daos || []).find(
        (d) => d.address === searchParams.get(RequiredQueryParams.DaoAddress)
      )
    })
  });

  const { data: tasks } = useGetNovaTasksQuery(nova?.address, {
    skip: !nova?.address
  });

  return (
    <PerfectScrollbar
      containerRef={(el) => (ps.current = el)}
      style={{
        ...(isMobile && {
          marginTop: `${TOOLBAR_HEIGHT + 70}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + 70 + "px"})`
        }),
        ...(!isMobile && {
          marginTop: `${TOOLBAR_HEIGHT}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + "px"})`
        }),
        display: "flex",
        flexDirection: "column"
      }}
    >
      <AutContainer>
        <LeftWrapper>
          <Stack
            sx={{
              width: "60%",
              maxWidth: "360px"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center"
              }}
            >
              <Avatar
                sx={{
                  flex: "1",
                  height: {
                    xs: "140px",
                    md: "150px",
                    xxl: "150px"
                  },
                  borderRadius: "0",
                  width: {
                    xs: "140px",
                    md: "150px",
                    xxl: "150px"
                  },
                  bgcolor: "purple"
                }}
                aria-label="avatar"
                src={ipfsCIDToHttpUrl(nova?.properties.image as string)}
              />
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "flex-start"
                }}
              >
                <Typography
                  color="offWhite.main"
                  textAlign="left"
                  lineHeight={1}
                  variant="h2"
                >
                  {nova?.name}
                </Typography>
              </div>
            </Box>

            <Stack
              sx={{
                marginTop: theme.spacing(2)
              }}
            >
              <div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Stack
                    sx={{
                      flex: "1",
                      flexBasis: "50%",
                      width: "100%"
                    }}
                    direction="row"
                    alignItems="center"
                  >
                    <CopyAddress address={nova?.address} />
                  </Stack>
                  <AutValueLabel
                    sx={{
                      flex: "1",
                      flexBasis: "50%"
                    }}
                    value={nova?.properties.absoluteValue}
                    label="Absolute Value"
                  ></AutValueLabel>
                </Box>
              </div>
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AutIconLabel
                sx={{
                  flex: "1",
                  flexBasis: "50%",
                  marginTop: theme.spacing(2)
                }}
                icon={<ArrowIcon />}
                label={Markets[nova?.properties.archetype]}
              ></AutIconLabel>
              <AutIconLabel
                sx={{
                  flex: "1",
                  flexBasis: "50%",
                  marginTop: theme.spacing(2)
                }}
                icon={
                  <img
                    src={ArchetypeIcons[nova?.properties.archetype]}
                    width="22px"
                    height="22px"
                  />
                }
                label={NovaArchetype[nova?.properties.archetype]}
              ></AutIconLabel>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <IconContainer>
                {nova?.properties.socials.map((social, index) => {
                  const AutIcon = socialIcons[Object.keys(socialIcons)[index]];

                  return (
                    <Link
                      key={`social-icon-${index}`}
                      {...(!!social.link && {
                        component: "a",
                        href: social.link,
                        target: "_blank",
                        sx: {
                          svg: {
                            color: theme.palette.offWhite.main
                          }
                        }
                      })}
                      {...((!social.link ||
                        social.link === socialUrls[social.type].prefix) && {
                        sx: {
                          // display: "none",
                          svg: {
                            color: theme.palette.divider
                          }
                        },
                        component: "button",
                        disabled: true
                      })}
                    >
                      <SvgIcon
                        sx={{
                          marginTop: theme.spacing(2),
                          height: {
                            xs: "25px",
                            xxl: "30px"
                          },
                          width: {
                            xs: "25px",
                            xxl: "30px"
                          },
                          mr: {
                            xs: "10px",
                            xxl: "15px"
                          }
                        }}
                        key={`socials.${index}.icon`}
                        component={AutIcon}
                      />
                    </Link>
                  );
                })}
              </IconContainer>

              <AutValueLabel
                sx={{
                  flex: "1",
                  flexBasis: "50%",
                  marginTop: theme.spacing(2)
                }}
                value={nova?.properties.members}
                label="Members"
              ></AutValueLabel>
            </Box>
            <Box
              sx={{
                marginTop: theme.spacing(2)
              }}
            >
              <Box>
                <Typography
                  sx={{ flex: "1" }}
                  color="offWhite.main"
                  textAlign="left"
                  variant="body"
                >
                  {nova?.properties.description || "No description yet..."}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </LeftWrapper>
        <RightWrapper>
          {!!tasks && !!nova && <AutUserTabs nova={nova} tasks={tasks.tasks} />}
        </RightWrapper>
      </AutContainer>
    </PerfectScrollbar>
  );
};

export default memo(NovaDetails);