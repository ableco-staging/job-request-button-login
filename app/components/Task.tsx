import { Avatar, CheckboxInput } from "@ableco/abledev-components";
import toggleTask from "app/tasks/mutations/toggleTask";
import listTasks, { ListedTask } from "app/tasks/queries/listTasks";
import { invalidateQuery, useMutation } from "blitz";
import { format } from "date-fns";

function Task({ task }: { task: ListedTask }) {
  const [toggleTaskMutation] = useMutation(toggleTask, {
    onSuccess: () => invalidateQuery(listTasks),
  });

  const toggleCompletion = () => {
    toggleTaskMutation({ id: task.id });
  };

  const handleDateClick = () => {};

  return (
    <div className="flex justify-between">
      <CheckboxInput
        label={task.description}
        checked={!!task.completedAt}
        onChange={toggleCompletion}
        description={
          <span className="block text-xs text-gray-400 mt-1">
            {/* NOTE: This button should be THE job request */}
            <button onClick={handleDateClick}>
              {task.dueDate ? (
                format(task.dueDate, "MMMM dd")
              ) : (
                <span className="underline">Add Date</span>
              )}
            </button>
          </span>
        }
      />
      <Avatar
        variant="circular"
        size="base"
        src={task.assignedUser?.picture ?? undefined}
        alt="Avatar"
        placeholder={<Avatar.PlaceholderInitials initials="AP" />}
      />
    </div>
  );
}

export default Task;
