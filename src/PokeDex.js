import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import {
  Collapse,
  Pagination,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Table,
} from "antd";
import {
  SearchOutlined,
  SortAscendingOutlined,
  RiseOutlined,
  ToTopOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const { Panel } = Collapse;
const { Option } = Select;
const { Column } = Table;

const baseUrl = "https://pokeapi.co/api/v2/pokemon";

function PokeDex() {
  const [allPokemonsData, setAllPokemonsData] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPageStartingItem, setCurrentPageStartingItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingMode, setSortingMode] = useState("byname");

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

  const totalPokemonsNumber = 100;

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

    switch (sortingMode) {
      case "byname":
        filteredPokes.sort((a, b) => {
          return a?.data?.name.localeCompare(b?.data?.name);
        });
        break;
      case "baseexperience":
        filteredPokes.sort((a, b) => {
          return a?.data?.base_experience - b?.data?.base_experience;
        });
        break;
      case "weight":
        filteredPokes.sort((a, b) => {
          return a?.data?.weight - b?.data?.weight;
        });
        break;
      case "height":
        filteredPokes.sort((a, b) => {
          return a?.data?.height - b?.data?.height;
        });
        break;
    }

    console.log(filteredPokes);

    setPokemons(
      filteredPokes.slice(
        currentPageStartingItem,
        currentPageStartingItem + pageSize,
      ),
    );
  }, [
    filterText,
    allPokemonsData,
    currentPageStartingItem,
    pageSize,
    sortingMode,
  ]);

  const typesChecker = (pokemonType) => {
    switch (pokemonType) {
      case "bug":
        return "#a8b820";
        break;
      case "dark":
        return "#705848";
        break;
      case "dragon":
        return "#7038f8";
        break;
      case "electric":
        return "#f8d030";
        break;
      case "fairy":
        return "#ee99ac";
        break;
      case "fighting":
        return "#c03028";
        break;
      case "fire":
        return "#f08030";
        break;
      case "flying":
        return "#a890f0";
        break;
      case "ghost":
        return "#705898";
        break;
      case "grass":
        return "#78c850";
        break;
      case "ground":
        return "#e0c068";
        break;
      case "ice":
        return "#98d8d8";
        break;
      case "normal":
        return "#a8a878";
        break;
      case "poison":
        return "#a040a0";
        break;
      case "psychic":
        return "#f85888";
        break;
      case "rock":
        return "#b8a038";
        break;
      case "steel":
        return "#b8b8d0";
        break;
      case "water":
        return "#6890f0";
        break;
    }
  };

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
            <div className='navigation_container'>
              <div className='filter_input dummy-box'></div>
              <Input
                className='pokemon_filter_input'
                style={{ color: "black" }}
                type='text'
                prefix={<SearchOutlined />}
                placeholder='Search pokemon'
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setCurrentPage(1);
                  setCurrentPageStartingItem(0);
                }}
              />
              <div className='filter_input'>
                <Select
                  showSearch
                  placeholder='Sort by'
                  onChange={(e) => {
                    setSortingMode(e);
                    setCurrentPage(1);
                    setCurrentPageStartingItem(0);
                  }}>
                  <Option value='byname'>
                    <SortAscendingOutlined /> By Name
                  </Option>
                  <Option value='baseexperience'>
                    <ToTopOutlined /> Base Experience
                  </Option>
                  <Option value='height'>
                    <ColumnHeightOutlined /> By Height
                  </Option>
                  <Option value='weight'>
                    <RiseOutlined /> By Weight
                  </Option>
                </Select>
              </div>
            </div>
            {pokemons.map((pokemon) => (
              <Collapse
                accordion
                style={{ width: "min(95vw, 1000px)" }}
                key={"collapse" + pokemon?.data?.name}>
                <Panel
                  header={pokemon?.data?.name.toUpperCase()}
                  key={"panelkey" + pokemon?.data?.name}>
                  <div>
                    <Row>
                      <Col md={3} xs={6}>
                        <div className='pokemon-identity-wrapper'>
                          <Row>
                            <img
                              src={pokemon?.data?.sprites?.front_default}
                              style={{ marginBottom: 6 }}
                            />
                          </Row>
                          <Row>
                            {pokemon?.data?.types.map((eachType) => (
                              <Tag
                                style={{ marginTop: 4 }}
                                key={pokemon?.data?.name + eachType?.type?.name}
                                color={typesChecker(eachType?.type?.name)}>
                                {eachType?.type?.name}
                              </Tag>
                            ))}
                          </Row>
                        </div>
                      </Col>
                      <Col md={7} xs={17} offset={1}>
                        <div style={{ marginBottom: 16 }}>
                          <Table
                            pagination={false}
                            size='small'
                            dataSource={[
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[0]?.stat?.name,
                                statsName: pokemon?.data?.stats[0]?.stat?.name,
                                baseValue: pokemon?.data?.stats[0]?.base_stat,
                              },
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[1]?.stat?.name,
                                statsName: pokemon?.data?.stats[1]?.stat?.name,
                                baseValue: pokemon?.data?.stats[1]?.base_stat,
                              },
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[2]?.stat?.name,
                                statsName: pokemon?.data?.stats[2]?.stat?.name,
                                baseValue: pokemon?.data?.stats[2]?.base_stat,
                              },
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[3]?.stat?.name,
                                statsName: pokemon?.data?.stats[3]?.stat?.name,
                                baseValue: pokemon?.data?.stats[3]?.base_stat,
                              },
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[4]?.stat?.name,
                                statsName: pokemon?.data?.stats[4]?.stat?.name,
                                baseValue: pokemon?.data?.stats[4]?.base_stat,
                              },
                              {
                                key:
                                  pokemon?.data?.name +
                                  pokemon?.data?.stats[5]?.stat?.name,
                                statsName: pokemon?.data?.stats[5]?.stat?.name,
                                baseValue: pokemon?.data?.stats[5]?.base_stat,
                              },
                            ]}>
                            <Column title='Stat Name' dataIndex='statsName' />
                            <Column title='Base Value' dataIndex='baseValue' />
                          </Table>
                        </div>
                      </Col>
                      <Col md={12} xs={24} offset={1}>
                        <Row>
                          <Col span={24}>
                            <Bar
                              options={{
                                aspectRatio: 1.6,
                                indexAxis: "y",
                                elements: {
                                  bar: {
                                    borderWidth: 2,
                                  },
                                },
                                scales: {
                                  xAxes: {
                                    ticks: {
                                      autoSkip: false,
                                      source: "data",
                                    },
                                  },
                                },
                              }}
                              data={{
                                labels: pokemon?.data?.stats.map(
                                  (eachStat) => eachStat?.stat?.name,
                                ),
                                datasets: [
                                  {
                                    label: "Base Stats",
                                    data: pokemon?.data?.stats.map(
                                      (eachStat) => eachStat?.base_stat,
                                    ),
                                  },
                                ],
                              }}
                            />
                          </Col>
                        </Row>
                        <Row justify='end' style={{ marginTop: 16 }}>
                          <button>Download</button>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Panel>
              </Collapse>
            ))}

            <Pagination
              className='pagination'
              total={totalPokemonsNumber}
              defaultPageSize={20}
              defaultCurrent={1}
              current={currentPage}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
                setCurrentPageStartingItem((page - 1) * pageSize);
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
