import React from "react";
import { useHistory } from "react-router-dom";
import QualitiesTable from "../components/ui/qualitiesTable";
import { useQualities } from "../hooks/useQualites";

const QualitiesListPage = () => {
  const history = useHistory();

  const { qualities, deleteQuality } = useQualities();

  const handleEdit = (param) => {
    console.log(param);
    history.push(`/edit/${param}`);
  };

  const handleDelete = (id) => {
    deleteQuality(id);
  };

  return (
    <>
      <h1>Qualitites List Page</h1>
      <QualitiesTable
        onDelete={handleDelete}
        onEdit={handleEdit}
        data={qualities}
      />
    </>
  );
};

export default QualitiesListPage;