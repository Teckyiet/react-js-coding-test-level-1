import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import { Collapse, Pagination, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Option } = Select;

const baseUrl = "https://pokeapi.co/api/v2/pokemon";

function PokeDex() {
  const [allPokemonsData, setAllPokemonsData] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  const totalPokemonsNumber = 1126;

  useEffect(() => {
    axios
      .get(baseUrl, {
        params: {
          limit: totalPokemonsNumber,
        },
      })
      .then((res) => {
        res?.data?.results.map(async (data) => {
          await axios.get(data.url).then((responses) => {
            setAllPokemonsData((prev) => [...prev, responses]);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    allPokemonsData.length == totalPokemonsNumber && setIsLoading(true);
  }, [allPokemonsData]);

  useEffect(() => {
    setPokemons(allPokemonsData);

    const filteredPokes = allPokemonsData.filter((pokemon) => {
      return pokemon?.data?.name.includes(filterText);
    });

    console.log(filteredPokes);

    //sortting mechanism

    filteredPokes.sort((a, b) => {
      return a?.data?.weight - b?.data?.weight;
    });

    setPokemons(filteredPokes.slice(currentPage, currentPage + pageSize));
  }, [filterText, allPokemonsData, currentPage, pageSize]);

  // if (!isLoading && pokemons.length === 0) {
  //   return (
  //     <div>
  //       <header className='App-header'>
  //         <h1>Welcome to pokedex !</h1>
  //         <h2>Requirement:</h2>
  //         <ul>
  //           <li>
  //             Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex,
  //             and show a list of pokemon name.
  //           </li>
  //           <li>Implement React Loading and show it during API call</li>
  //           <li>
  //             when hover on the list item , change the item color to yellow.
  //           </li>
  //           <li>when clicked the list item, show the modal below</li>
  //           <li>
  //             Add a search bar on top of the bar for searching, search will run
  //             on keyup event
  //           </li>
  //           <li>Implement sorting and pagingation</li>
  //           <li>Commit your codes after done</li>
  //           <li>
  //             If you do more than expected (E.g redesign the page / create a
  //             chat feature at the bottom right). it would be good.
  //           </li>
  //         </ul>
  //       </header>
  //     </div>
  //   );
  // }

  return (
    <div>
      <header className='App-header'>
        {!isLoading ? (
          <>
            <div className='App'>
              <header className='App-header'>
                <ReactLoading
                  type='spin'
                  color='white'
                  height={200}
                  width={200}
                />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ color: "white" }}>Welcome to pokedex!</h1>
            <div className="navigation_container">
              <div className='filter_input dummy-box'></div>
              <Input
                className='pokemon_filter_input'
                style={{ color: "black" }}
                type='text'
                prefix={<SearchOutlined />}
                placeholder='Search pokemon'
                onChange={(e) => setFilterText(e.target.value)}
              />
              <div className='filter_input'>
                <Select
                  showSearch
                  onChange={(e) => {
                    console.log(e);
                  }}>
                  <Option value={123}>Sort 1</Option>
                  <Option value={2}>Sort 2</Option>
                  <Option value={3}>Sort 3</Option>
                </Select>
              </div>
            </div>
            {pokemons.map((pokemon) => (
              <Collapse
                accordion
                style={{ width: "min(95vw, 800px)" }}
                key={"collapse" + pokemon?.data?.name}>
                <Panel
                  header={pokemon?.data?.name}
                  key={"panelkey" + pokemon?.data?.name}>
                  <p>
                    <img src={pokemon?.data?.sprites?.front_default} />
                  </p>
                </Panel>
              </Collapse>
            ))}

            <Pagination
              className='pagination'
              total={totalPokemonsNumber}
              defaultPageSize={20}
              defaultCurrent={1}
              onChange={(page, pageSize) => {
                setPageSize(pageSize);
                setCurrentPage((page - 1) * pageSize);
              }}
            />
          </>
        )}
      </header>

      {/* {!pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}>
          <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li> DONE
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>
                Create a buttton to download the information generated in this
                modal as pdf. (images and chart must be included)
              </li>
            </ul>
          </div>
        </Modal>
      )} */}
    </div>
  );
}

export default PokeDex;
