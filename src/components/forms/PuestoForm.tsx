import { useForm } from "react-hook-form";
import { useAuth } from "../../context/auth/useContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { PuestoDto, updatePuestoSchema, createPuestoSchema } from "../../lib/api/puesto/puesto.types";
import { createPuesto, updatePuestoById } from "../../lib/api/puesto/puesto.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {
  initialValues?: PuestoDto;
};


const PuestoForm = ({ initialValues }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const schema = initialValues ? updatePuestoSchema : createPuestoSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PuestoDto>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: PuestoDto) => {
    const {
      data: res,
      message,
      success,
    } = initialValues
      ? await updatePuestoById(initialValues.id, data, session!.accessToken)
      : await createPuesto(data, session!.accessToken);

    if (res && success) {
      toast.success(message);
      navigate("/puestos");
    } else toast.error(message);
  };

  return (
    <form
      className="d-flex flex-column gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="d-flex flex-column gap-1">
        <label htmlFor="puesto">Puesto:</label>
        <input
          {...register("nombre")}
          type="text"
          id="puesto"
          autoComplete="off"
          placeholder="Escriba el nombre del puesto"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre.message}</div>
        )}
      </div>

      <div className="d-flex flex-column gap-1">
        <label htmlFor="sueldo">Sueldo:</label>
        <input
          {...register("sueldo")}
          type="number"
          id="sueldo"
          autoComplete="off"
          placeholder="0"
          className={`form-control ${errors.sueldo ? "is-invalid" : ""}`}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.sueldo?.message}</div>
        )}
      </div>

      <div className="mt-3 d-flex flex-column align-items-center gap-2">
        <button
          disabled={isSubmitting}
          type="submit"
          className="btn w-100 btn-primary"
        >
          {initialValues ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default PuestoForm;
