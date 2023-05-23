import { getCache, CacheTypes, updateCache, deleteCache } from "@api/cache.api";
import {
  useDeletePhasesCacheMutation,
  useGetPhasesCacheQuery,
  useLazyHasUserCompletedQuestQuery,
  useUpdatePhasesCacheMutation,
  useWithdrawFromAQuestMutation
} from "@api/onboarding.api";
import { isAuthenticated } from "@auth/auth.reducer";
import { LoadingButton } from "@mui/lab";
import { Stack, CircularProgress, Tooltip, Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { getMemberPhases } from "@utils/beta-phases";
import { addDays, isAfter, addMilliseconds } from "date-fns";
import { useMemo, useEffect } from "react";
import { useConfirmDialog } from "react-mui-confirm";
import { useSelector } from "react-redux";

const fractionToMiliseconds = (fraction: number) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return fraction * millisecondsInDay;
};

export const ApplyOrWithdrawFromQuest = ({
  daoData,
  quest,
  onApplyForQuest,
  questToApplyFor,
  isApplying
}) => {
  // const [cache, setCache] = useState<CacheModel>(null);
  const confirm = useConfirmDialog();
  const { account } = useEthers();
  const isOwner = useMemo(() => {
    return !!account && daoData?.admin === account;
  }, [account, daoData]);

  const [deletePhasesCache] = useDeletePhasesCacheMutation();

  const { cache } = useGetPhasesCacheQuery(
    { cacheKey: CacheTypes.UserPhases, account },
    {
      selectFromResult: ({ data }) => ({
        cache: data
      })
    }
  );

  const hasQuestStarted = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(new Date(), new Date(quest.startDate));
  }, [quest]);

  const hasMemberPhaseOneStarted = useMemo(() => {
    return isAfter(new Date(), new Date(getMemberPhases().phaseOneStartDate));
  }, [quest]);
  // const hasMemberPhaseOneStarted = true;

  const hasQuestEnded = useMemo(() => {
    if (!quest?.startDate) return false;
    return isAfter(
      new Date(),
      addMilliseconds(
        new Date(quest.startDate),
        fractionToMiliseconds(quest?.durationInDays)
      )
    );
  }, [quest]);

  const canApplyForAQuest = useMemo(() => {
    return !isOwner && !cache && !!hasMemberPhaseOneStarted && !hasQuestEnded;
  }, [cache, hasMemberPhaseOneStarted, hasQuestEnded, isOwner]);

  const hasAppliedForQuest = useMemo(() => {
    return (
      !!cache &&
      cache?.onboardingQuestAddress == daoData.onboardingQuestAddress &&
      cache?.questId === quest.questId
    );
  }, [cache]);

  const [
    withdraw,
    {
      isLoading: isWithdrawing,
      reset: withdrawReset,
      isSuccess: withdrawIsSuccess
    }
  ] = useWithdrawFromAQuestMutation();

  const confimWithdrawal = () =>
    confirm({
      title: "Are you sure you want to withdraw from quest?",
      confirmButtonText: "Withdraw",
      onConfirm: async () => {
        withdraw({
          onboardingQuestAddress: daoData.onboardingQuestAddress,
          questId: +quest.questId
        });
      }
    });

  useEffect(() => {
    if (withdrawIsSuccess) {
      const start = async () => {
        try {
          onApplyForQuest(null);
          deletePhasesCache(CacheTypes.UserPhases);
          withdrawReset();
        } catch (error) {
          console.log(error);
        }
      };
      start();
    }
  }, [withdrawIsSuccess]);

  return (
    <>
      {hasAppliedForQuest && (
        <LoadingButton
          onClick={(e) => {
            e.stopPropagation();
            confimWithdrawal();
          }}
          disabled={isWithdrawing}
          loadingIndicator={
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size="20px" color="offWhite" />
            </Stack>
          }
          loading={isWithdrawing}
          size="medium"
          color="error"
          variant="outlined"
        >
          Withdraw
        </LoadingButton>
      )}
      {canApplyForAQuest && (
        <LoadingButton
          onClick={(e) => {
            e.stopPropagation();
            onApplyForQuest({
              ...quest,
              onboardingQuestAddress: daoData.onboardingQuestAddress,
              daoAddress: daoData.daoAddress
            });
          }}
          //get those
          disabled={isApplying}
          loadingIndicator={
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size="20px" color="offWhite" />
            </Stack>
          }
          loading={
            isApplying &&
            questToApplyFor.questId === quest.questId &&
            questToApplyFor.daoAddress === daoData.daoAddress
          }
          size="medium"
          color="primary"
          variant="outlined"
        >
          Apply
        </LoadingButton>
      )}
      {!canApplyForAQuest && !hasAppliedForQuest && (
        <Tooltip
          title={
            hasQuestEnded
              ? "Quest has ended"
              : !hasQuestStarted
              ? "Quest hasn't started yet"
              : !hasMemberPhaseOneStarted
              ? "Member phase hasn't started yet."
              : "Already applied to another quest"
          }
        >
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled={true}
              size="medium"
              color="primary"
              variant="outlined"
            >
              Apply
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};
