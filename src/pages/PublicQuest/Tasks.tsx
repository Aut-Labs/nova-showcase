import { Task } from "@aut-labs/sdk";
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Button,
  Icon,
  SvgIcon,
  Tooltip,
  Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { memo, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams
} from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";
import { TaskStatus, TaskType } from "@aut-labs/sdk/dist/models/task";
import { useGetAllPluginDefinitionsByDAOQuery } from "@api/plugin-registry.api";
import OverflowTooltip from "@components/OverflowTooltip";
import AutLoading from "@components/AutLoading";
import { useRemoveTaskFromQuestMutation } from "@api/onboarding.api";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import { differenceInDays } from "date-fns";
import { useConfirmDialog } from "react-mui-confirm";
import { RequiredQueryParams } from "@api/RequiredQueryParams";

export const taskStatuses: any = {
  [TaskStatus.Created]: {
    label: "To Do",
    color: "info"
  },
  [TaskStatus.Finished]: {
    label: "Completed",
    color: "success"
  },
  [TaskStatus.Submitted]: {
    label: "Pending",
    color: "warning"
  },
  [TaskStatus.Taken]: {
    label: "Taken",
    color: "info"
  }
};

const taskTypes = {
  [TaskType.Open]: {
    pluginType: PluginDefinitionType.OnboardingOpenTaskPlugin,
    label: "Open Task"
  },
  [TaskType.ContractInteraction]: {
    pluginType: PluginDefinitionType.OnboardingTransactionTaskPlugin,
    label: "Contract Interaction"
  },
  [TaskType.Quiz]: {
    pluginType: PluginDefinitionType.OnboardingQuizTaskPlugin,
    label: "Multiple-Choice Quiz"
  },
  [TaskType.JoinDiscord]: {
    pluginType: PluginDefinitionType.OnboardingJoinDiscordTaskPlugin,
    label: "Join Discord"
  }
};

// interface TasksParams {
//   isLoading: boolean;
//   tasks: Task[];
//   quest: Quest;
//   hasQuestStarted: boolean;
//   hasAppliedForQuest: boolean;
// }

interface TasksParams {
  isLoading: boolean;
  tasks: Task[];
  canDelete?: boolean;
  isAdmin: boolean;
  canSubmitTask: boolean;
  onboardingQuestAddress: string;
  questId: number;
}

const TaskCard = ({
  row,
  isAdmin,
  canDelete,
  canSubmitTask,
  onboardingQuestAddress,
  questId
}: {
  row: Task;
  isAdmin: boolean;
  canDelete: boolean;
  canSubmitTask: boolean;
  onboardingQuestAddress: string;
  questId: number;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { plugin } = useGetAllPluginDefinitionsByDAOQuery(null, {
    selectFromResult: ({ data }) => ({
      questOnboarding: (data || []).find(
        (p) =>
          PluginDefinitionType.QuestOnboardingPlugin === p.pluginDefinitionId
      ),
      plugin: (data || []).find(
        (p) => taskTypes[row.taskType].pluginType === p.pluginDefinitionId
      )
    })
  });

  const path = useMemo(() => {
    if (!plugin) return;
    return `task/${PluginDefinitionType[plugin.pluginDefinitionId]}`;
  }, [plugin]);

  return (
    <>
      <GridCard
        sx={{
          bgcolor: "nightBlack.main",
          borderColor: "divider",
          borderRadius: "16px",
          minHeight: "385px",
          boxShadow: 7,
          display: "flex",
          flexDirection: "column"
        }}
        variant="outlined"
      >
        <CardHeader
          sx={{
            alignItems: "flex-start",
            ".MuiCardHeader-action": {
              mt: "3px"
            }
          }}
          titleTypographyProps={{
            fontFamily: "FractulAltBold",
            mb: 2,
            fontWeight: 900,
            color: "white",
            variant: "subtitle1"
          }}
          subheaderTypographyProps={{
            color: "white"
          }}
          title={row?.metadata?.name}
          avatar={
            row.status === TaskStatus.Finished ||
            row.status === TaskStatus.Submitted ? (
              <CheckCircleIcon sx={{ color: "#2e7d32" }} />
            ) : null
          }
        />
        <CardContent
          sx={{
            pt: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Stack flex={1} direction="column" gap={2}>
            <Typography variant="body" color="white">
              Status:{" "}
              <Chip
                sx={{
                  ml: 1
                }}
                label={taskStatuses[row.status].label}
                color={taskStatuses[row.status].color}
                size="small"
              />
            </Typography>

            <Typography variant="body" color="white">
              Task type: {taskTypes[row.taskType]?.label}
            </Typography>
            <Typography variant="body" color="white">
              Duration:{" "}
              {differenceInDays(new Date(row.endDate), new Date(row.startDate))}{" "}
              days
            </Typography>

            <OverflowTooltip maxLine={4} text={row.metadata?.description} />
          </Stack>

          <Box
            sx={{
              width: "100%",
              display: "flex"
            }}
          >
            <Button
              sx={{
                width: "80%",
                mt: 6,
                mb: 4,
                mx: "auto"
              }}
              disabled={!canSubmitTask}
              onClick={() => {
                navigate({
                  pathname: `/quest/${path}/${row.taskId}`,
                  search: new URLSearchParams({
                    questId: searchParams.get(RequiredQueryParams.QuestId),
                    onboardingQuestAddress: searchParams.get(
                      RequiredQueryParams.OnboardingQuestAddress
                    ),
                    daoAddress: searchParams.get(
                      RequiredQueryParams.DaoAddress
                    ),
                    returnUrlLinkName: "Back to quest",
                    returnUrl: `${location?.pathname}${location?.search}`
                  }).toString()
                });
              }}
              size="large"
              variant="outlined"
              color="offWhite"
            >
              Go to task
            </Button>
          </Box>
        </CardContent>
      </GridCard>
    </>
  );
};

const GridCard = styled(Card)(({ theme }) => {
  return {
    minHeight: "365px",
    width: "100%",
    transition: theme.transitions.create(["transform"]),
    "&:hover": {
      transform: "scale(1.019)"
    }
  };
});

const GridBox = styled(Box)(({ theme }) => {
  return {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridGap: "30px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    }
  };
});

const Tasks = ({
  isLoading,
  tasks,
  isAdmin,
  canDelete,
  onboardingQuestAddress,
  canSubmitTask,
  questId
}: TasksParams) => {
  return (
    <Box>
      {isLoading ? (
        <AutLoading width="130px" height="130px" />
      ) : (
        <>
          {!!tasks?.length && (
            <GridBox sx={{ flexGrow: 1, mt: 4 }}>
              {tasks.map((row, index) => (
                <TaskCard
                  canSubmitTask={canSubmitTask}
                  onboardingQuestAddress={onboardingQuestAddress}
                  questId={questId}
                  isAdmin={isAdmin}
                  canDelete={canDelete}
                  key={`table-row-${index}`}
                  row={row}
                />
              ))}
              {/* <EmptyTaskCard
                onboardingQuestAddress={onboardingQuestAddress}
                questId={questId}
              /> */}
            </GridBox>
            // <TableContainer
            //   sx={{
            //     minWidth: {
            //       sm: "700px"
            //     },
            //     width: {
            //       xs: "360px",
            //       sm: "unset"
            //     },
            //     borderRadius: "16px",
            //     backgroundColor: "nightBlack.main",
            //     borderColor: "divider",
            //     my: 4
            //   }}
            //   component={Paper}
            // >
            //   <Table
            //     sx={{
            //       minWidth: {
            //         xs: "700px",
            //         sm: "unset"
            //       },
            //       ".MuiTableBody-root > .MuiTableRow-root:hover": {
            //         backgroundColor: "#ffffff0a"
            //       }
            //     }}
            //   >
            //     <TableHead>
            //       <TableRow>
            //         <TaskStyledTableCell>Name</TaskStyledTableCell>

            //         {!isAdmin && (
            //           <TaskStyledTableCell align="right">
            //             Creator
            //           </TaskStyledTableCell>
            //         )}

            //         <TaskStyledTableCell align="right">
            //           Status
            //         </TaskStyledTableCell>
            //         <TaskStyledTableCell align="right">
            //           Task type
            //         </TaskStyledTableCell>
            //         {isAdmin && canDelete && (
            //           <TaskStyledTableCell align="right">
            //             Action
            //           </TaskStyledTableCell>
            //         )}
            //       </TableRow>
            //     </TableHead>
            //     <TableBody>
            //       {tasks?.map((row, index) => (
            //         <TaskListItem
            //           isAdmin={isAdmin}
            //           canDelete={canDelete}
            //           key={`table-row-${index}`}
            //           row={row}
            //         />
            //       ))}
            //     </TableBody>
            //   </Table>
            // </TableContainer>
          )}

          {!isLoading && !tasks?.length && (
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                pt: 12,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography className="text-secondary" variant="subtitle2">
                No tasks yet...
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default memo(Tasks);
