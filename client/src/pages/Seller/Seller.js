import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Auth from "../../auth/auth";
import { QUERY_SELLERS_GAMES } from "../../graphql/queries";
import UpdateGame from "./UpdateGame";
import { REMOVE_GAME } from "../../graphql/mutations";

export default function Seller() {
  const { userId } = useParams();
  const { loading, error, data } = useQuery(QUERY_SELLERS_GAMES, {
    variables: { id: userId },
  });

  const [removeGame] = useMutation(REMOVE_GAME);
  const handleRemove = (event, gameId) => {
    // event.preventDefault();
    const { data } = removeGame({   // incomplete
      variables: {
        id: gameId,
      },
      // update: (cache, { data: { id } }) =>  {
      //   cache.modify()
      // }};
    });
    window.location.reload();
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`${error}`}</p>;

  return (
    <div>
      <div>
        <h1>{Auth.getProfile().data.username}'s Games</h1>
        <Row xs={1} sm={2} md={3} className="g-4">
          {data.getSellersGames.games.map((game) => (
            <Col key={game._id}>
              <Card style={{ width: "18rem", height: "100%" }}>
                <Card.Img
                  className="zoom img"
                  variant="top"
                  src={game.imgUrl}
                  style={{
                    height: "10rem",
                    width: "18rem",
                    objectFit: "cover",
                  }}
                />
                <Card.Body className="cardbody">
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Text>{game.price}</Card.Text>
                  <Card.Text>{game.category}</Card.Text>
                  <div>
                    <UpdateGame gameId={game._id} name={game.name} description={game.description} price={game.price} category={game.category}
                    />
                    <button onClick={(event) => handleRemove(event, game._id)}>
                      Delete Game
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
