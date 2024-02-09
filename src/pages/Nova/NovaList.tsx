/* eslint-disable max-len */
import AutLoading from "@components/AutLoading";
import {
  Container,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  styled,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useEffect, useMemo, useState } from "react";
import NovaCard from "@components/NovaCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ConnectStatus,
  IsAuthenticated,
  changeConnectStatus
} from "@auth/auth.reducer";
import { CacheTypes } from "@api/cache.api";
import { communityUpdateState } from "@store/Community/community.reducer";
import { useAppDispatch } from "@store/store.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { useGetAllNovasQuery } from "@api/community.api";
import { TOOLBAR_HEIGHT } from "./ToolbarConnector";
import { addDays } from "date-fns";
import { Quest, fetchMetadata, queryParamsAsString } from "@aut-labs/sdk";
import { useAccount } from "wagmi";
import {
  IsAuthorised,
  updateWalletProviderState
} from "@store/WalletProvider/WalletProvider";
import backgroundImage from "@assets/autos/background.png";
import { AutSelectField } from "@theme/field-select-styles";
import { Community } from "@api/community.model";
import { gql, useQuery } from "@apollo/client";
import { ReactComponent as Filters } from "@assets/icons/filters.svg";
import { ReactComponent as Markets } from "@assets/icons/markets.svg";
import { ReactComponent as Archetypes } from "@assets/icons/archetype.svg";

const AutContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  paddingLeft: "60px",
  paddingRight: "60px"
  // backgroundImage: `url(${backgroundImage})`,
  // backgroundBlendMode: "hard-light",
  // backgroundSize: "cover"
}));

export const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  },
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr"
  }
}));

export const NovaList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [searchParams] = useSearchParams();
  const connectStatus = useSelector(ConnectStatus);
  const theme = useTheme();
  const { address: account } = useAccount();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeOnboardingFilter, setActiveOnboardingFilter] = useState("");
  const [marketFilter, setMarkerFilter] = useState("");
  const [archetypeFilter, setArchetypeFilter] = useState("");

  const { data, isLoading, isFetching } = useGetAllNovasQuery(
    { marketFilter },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  );

  return (
    <PerfectScrollbar
      style={{
        ...(isMobile && {
          marginTop: `${TOOLBAR_HEIGHT + 80}px`,
          height: `calc(100% - ${TOOLBAR_HEIGHT + 80 + "px"})`
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
        <ErrorDialog handleClose={() => null} open={null} message={null} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "25px",
            width: "70%",
            mt: "100px"
          }}
        >
          <AutSelectField
            value={activeOnboardingFilter}
            color="offWhite"
            defaultValue={""}
            placeholder="Onboarding Status"
            onChange={(e) =>
              setActiveOnboardingFilter(e.target.value as string)
            }
            startAdornment={
              <InputAdornment
                position="start"
                sx={{ width: "30px", height: "30px" }}
              >
                <Filters />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>All Novae</em>
            </MenuItem>
            <MenuItem value="Active">
              <em>Active</em>
            </MenuItem>
            <MenuItem value="Inactive">
              <em>Inactive</em>
            </MenuItem>
          </AutSelectField>
          <AutSelectField
            value={marketFilter}
            color="offWhite"
            onChange={(e) => setMarkerFilter(e.target.value as string)}
            startAdornment={
              <InputAdornment
                position="start"
                sx={{ width: "30px", height: "30px" }}
              >
                <Markets />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>All Markets</em>
            </MenuItem>
            <MenuItem value="1">
              <em>Open-Source & Infra</em>
            </MenuItem>
            <MenuItem value="2">
              <em>Art, Events & NFTs</em>
            </MenuItem>
            <MenuItem value="3">
              <em>Social, Gaming & DeFi</em>
            </MenuItem>
            <MenuItem value="4">
              <em>ReFi & Public Goods</em>
            </MenuItem>
          </AutSelectField>
          <AutSelectField
            value={archetypeFilter}
            color="offWhite"
            onChange={(e) => setArchetypeFilter(e.target.value as string)}
            startAdornment={
              <InputAdornment
                position="start"
                sx={{ width: "30px", height: "30px" }}
              >
                <Archetypes />
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>Archetype</em>
            </MenuItem>
            <MenuItem value="Growth">
              <em>Growth</em>
            </MenuItem>
            <MenuItem value="Performance">
              <em>Performance</em>
            </MenuItem>
            <MenuItem value="Size">
              <em>Size</em>
            </MenuItem>
            <MenuItem value="Reputation">
              <em>Reputation</em>
            </MenuItem>
            <MenuItem value="Conviction">
              <em>Conviction</em>
            </MenuItem>
          </AutSelectField>
        </Box>
        {isLoading && (
          <CircularProgress size={23} color="secondary"></CircularProgress>
        )}

        {!isLoading && !(data?.daos || [])?.length && (
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              mt: 12,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography color="rgb(107, 114, 128)" variant="subtitle2">
              No Novas were found...
            </Typography>
            <Button
              size="medium"
              component="span"
              color="offWhite"
              startIcon={<RefreshIcon />}
              sx={{
                ml: 1
              }}
              disabled={isLoading || isFetching}
              // onClick={refetch}
            >
              Refresh
            </Button>
          </Box>
        )}

        {isLoading ? (
          <AutLoading width="130px" height="130px" />
        ) : (
          <>
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {(data?.daos || []).map((dao, index) => (
                <NovaCard key={`nova-card-${index}`} daoData={dao} />
              ))}
            </GridBox>
          </>
        )}
      </AutContainer>
    </PerfectScrollbar>
  );
};