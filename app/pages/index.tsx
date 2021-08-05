import { BlitzPage, invalidateQuery, useMutation, useQuery } from "blitz";
import Layout from "app/core/layouts/Layout";
import protectPage from "app/core/helpers/protectPage";
import { ListContainer, TextInput } from "@ableco/abledev-components";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import createTask from "app/tasks/mutations/createTask";
import listTasks from "app/tasks/queries/listTasks";
import TaskComponent from "app/components/Task";
import { io } from "socket.io-client";

const Home: BlitzPage = () => {
  const [hideCompletedTasks, setHideCompleteTasks] = useState(true);

  const toggleHiding = useCallback(() => {
    setHideCompleteTasks(!hideCompletedTasks);
  }, [hideCompletedTasks]);

  useEffect(() => {
    const socket = io(window.location.origin);

    socket.on("updatedTasks", (message) => {
      invalidateQuery(listTasks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="mt-14 mx-auto flex flex-col justify-center space-y-4"
      style={{ width: 500 }}
    >
      <CreateTaskForm />
      <TasksList hideCompletedTasks={hideCompletedTasks} />
      <p className="text-center">
        <button
          className="text-gray-400 text-sm cursor-pointer underline"
          onClick={toggleHiding}
        >
          {hideCompletedTasks ? <>Show</> : <>Hide</>} completed tasks
        </button>
      </p>
    </div>
  );
};

function CreateTaskForm() {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskMutation] = useMutation(createTask, {
    onSuccess: () => invalidateQuery(listTasks),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 0) {
      setIsSubmitting(true);
      await createTaskMutation({ description: trimmedDescription });
      setIsSubmitting(false);
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="New task description"
        hideLabel
        className="w-full"
        placeholder="Add a new task..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
    </form>
  );
}

function TasksList({ hideCompletedTasks }: { hideCompletedTasks: boolean }) {
  const [tasks] = useQuery(listTasks, {});

  const filteredTasks = useMemo(() => {
    if (hideCompletedTasks) {
      return tasks.filter((task) => !task.completedAt);
    } else {
      return tasks;
    }
  }, [hideCompletedTasks, tasks]);

  return (
    <div className="w-full">
      <ListContainer variant="simple">
        {filteredTasks.map((task) => {
          return <TaskComponent key={task.id} task={task} />;
        })}
      </ListContainer>
    </div>
  );
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;
Home.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default Home;
