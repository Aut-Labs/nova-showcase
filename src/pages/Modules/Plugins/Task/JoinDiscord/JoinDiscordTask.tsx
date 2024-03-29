import {
  useGetAllTasksPerQuestQuery,
  useSubmitJoinDiscordTaskMutation
} from "@api/onboarding.api";
import { PluginDefinition } from "@aut-labs/sdk";
import AutLoading from "@components/AutLoading";
import { Container, Stack } from "@mui/material";
import { CommunityData, IsAdmin } from "@store/Community/community.reducer";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { RequiredQueryParams } from "@api/RequiredQueryParams";
import { taskTypes } from "../Shared/Tasks";
import { PluginDefinitionType } from "@aut-labs/sdk/dist/models/plugin";
import { TaskStatus } from "@aut-labs/sdk/dist/models/task";
import { useOAuth } from "@components/Oauth2/oauth2";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import SuccessDialog from "@components/Dialog/SuccessPopup";
import { StepperButton } from "@components/StepperButton";
import { useAccount } from "wagmi";

interface PluginParams {
  plugin: PluginDefinition;
}

const JoinDiscordTask = ({ plugin }: PluginParams) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const { address: userAddress } = useAccount();
  const isAdmin = useSelector(IsAdmin);
  const { getAuth } = useOAuth();
  const [joinClicked, setJoinClicked] = useState(false);
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const { task, isLoading: isLoadingTasks } = useGetAllTasksPerQuestQuery(
    {
      userAddress,
      isAdmin,
      pluginAddress: searchParams.get(
        RequiredQueryParams.OnboardingQuestAddress
      ),
      questId: +searchParams.get(RequiredQueryParams.QuestId)
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        task: (data?.tasks || []).find((t) => {
          const [pluginType] = location.pathname.split("/").splice(-2);
          return (
            t.taskId === +params?.taskId &&
            PluginDefinitionType[pluginType] ===
              taskTypes[t.taskType].pluginType
          );
        })
      })
    }
  );

  const [
    submitJoinDiscordTask,
    { isSuccess, error, isError, isLoading, reset }
  ] = useSubmitJoinDiscordTaskMutation();

  const onSubmit = async () => {
    await getAuth(
      async (data) => {
        const { access_token } = data;

        submitJoinDiscordTask({
          userAddress,
          task,
          bearerToken: access_token,
          onboardingPluginAddress: searchParams.get(
            RequiredQueryParams.OnboardingQuestAddress
          )
        });
      },
      () => {
        setJoinClicked(false);
      }
    );
  };

  useEffect(() => {
    if (isSuccess) {
      setOpenSubmitSuccess(true);
    }
  }, [isSuccess]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: "30px",
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <ErrorDialog handleClose={() => reset()} open={isError} message={error} />
      <LoadingDialog open={isLoading} message="Submitting task..." />
      <SuccessDialog
        open={openSubmitSuccess}
        message="Congrats!"
        titleVariant="h2"
        subtitle="You successfully submitted the task!"
        subtitleVariant="subtitle1"
        handleClose={() => {
          setOpenSubmitSuccess(false);
          navigate({
            pathname: "/quest",
            search: searchParams.toString()
          });
        }}
      ></SuccessDialog>

      {task ? (
        <>
          <TaskDetails task={task} />
          <Stack
            direction="column"
            gap={8}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "650px",
                xxl: "800px"
              }
            }}
          >
            <Stack
              sx={{
                margin: "0 auto",
                width: {
                  xs: "100%",
                  sm: "400px",
                  xxl: "500px"
                }
              }}
            >
              {joinClicked && (
                <StepperButton
                  label="Confirm"
                  disabled={task?.status !== TaskStatus.Created}
                  onClick={() => onSubmit()}
                  sx={{ width: "250px", margin: "0 auto" }}
                />
              )}
              {!joinClicked && (
                <StepperButton
                  label="Join"
                  disabled={
                    task?.status !== TaskStatus.Created || isLoadingTasks
                  }
                  onClick={() => {
                    setJoinClicked(true);
                    window.open(
                      task.metadata.properties["inviteUrl"],
                      "_blank"
                    );
                  }}
                  sx={{ width: "250px", margin: "0 auto" }}
                />
              )}
              {/* <Button
                startIcon={<OpenInNewIcon />}
                sx={{
                  textTransform: "uppercase"
                }}
                type="button"
                size="medium"
                color="offWhite"
                disabled={task?.status !== TaskStatus.Created}
                variant="outlined"
                component={Link}
                target="_blank"
                to={(task as any)?.metadata?.properties?.inviteUrl}
                onClick={setButtonClicked}
              >
                Join Discord
              </Button> */}
            </Stack>
            {/* <Box
              sx={{
                width: "100%",
                display: "flex",
                mb: 4,
                justifyContent: {
                  xs: "center",
                  sm: "flex-end"
                }
              }}
            >
              <StepperButton
                label="Confirm"
                disabled={task?.status !== TaskStatus.Created}
                onClick={handleSubmit(onSubmit)}
                sx={{ width: "250px" }}
              />
            </Box> */}
          </Stack>
        </>
      ) : (
        <AutLoading width="130px" height="130px"></AutLoading>
      )}
    </Container>
  );
};

export default memo(JoinDiscordTask);
