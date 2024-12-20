import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { EmpleadoDto } from "../../lib/api/empleado/empleado.types";
import CustomModal from "../global/CustomModal";
import { UserDto } from "../../lib/api/user/user.types";
import { useDebounce } from "@uidotdev/usehooks";
import { getAllUsers } from "../../lib/api/user/user.service";
import { useAuth } from "../../context/auth/useContext";

type Props = {
  display: boolean;
  setDisplay: (value: boolean) => void;
  setValue: UseFormSetValue<EmpleadoDto>;
};

const SelectPuestoModal = ({ display, setDisplay, setValue }: Props) => {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserDto[]>([]);
  const debouncedQuery = useDebounce(query, 500);

  if (!display) return null;

  const onCloseHanlder = () => setDisplay(false);
  const onSubmitHandler = (id: number) => {
    return () => {
      setValue("user_id", id, { shouldValidate: true });
      setDisplay(false);
    };
  };

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await getAllUsers(session!.accessToken, {
        username: debouncedQuery,
      });
      setUsers(data.content);
    };
    getUsers();
  }, [debouncedQuery]);

  return (
    <CustomModal
      title="Seleccione un usuario"
      type="primary"
      onClose={onCloseHanlder}
    >
      <div className="d-flex flex-column gap-4">
        <input
          className="flex-grow-1 form-control"
          placeholder="Buscar por username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="d-flex flex-column gap-2">
          {users.length > 0 &&
            users.map((user) => (
              <button
                className="btn btn-outline-primary btn-sm text-start"
                type="button"
                onClick={onSubmitHandler(user.id)}
                key={user.id}
              >
                ID:{user.id}-{user.username}
              </button>
            ))}
        </div>
      </div>
    </CustomModal>
  );
};

export default SelectPuestoModal;
