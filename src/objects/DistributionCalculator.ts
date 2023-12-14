import {transpose, Vector2, vector2Neighbors} from "../general/MathUtils";
import {BUILDING_NEEDS, BuildingNeed} from "./BuildingData";
import {Vector2Dict} from "../general/Dict";
import {To} from "copy-webpack-plugin";

export class DistributionCalculator {

    // Ford Fulkerson
    static findOptimalDistribution(townState: Map<number, TownBuilding>): Map<number, TownBuilding> {
        // Add start
        let numberOfBuildings = townState.size
        let indexMap = new Vector2Dict([...townState.values()].map(building => [building.index, building]))

        for (let need_type of BUILDING_NEEDS) {
            let flowGraph: number[][] = [...Array(numberOfBuildings + 2).keys()]
                .map(_ => [...Array(numberOfBuildings + 2).keys()].fill(0))
            let producerRowIndex = numberOfBuildings
            let consumerColIndex = numberOfBuildings + 1

            for (let [index, producer] of townState) {

                if (producer.supplyType == need_type) {
                    flowGraph[producerRowIndex][index] = producer.supply
                }

                for (let neighborIndex of vector2Neighbors(producer.index)) {

                    if (indexMap.has(neighborIndex)) {
                        let neighborBuilding = indexMap.get(neighborIndex)
                        let neighborIterIndex = neighborBuilding.iterationIndex
                        let neighborNeed = neighborBuilding.needs.find(need => need.type === need_type)

                        if (neighborNeed) {
                            flowGraph[neighborIterIndex][consumerColIndex] = neighborNeed.left
                            flowGraph[producer.iterationIndex][neighborIterIndex] = producer.supply
                        }
                    }
                }
            }

            // Calculate optimal flow with ford Fulkerson
            let optimalNeedFlow = this.fordFulkerson(flowGraph, producerRowIndex, consumerColIndex)


            // Update State with new flow
            for (let [producerIndex, producer] of townState) {

                if (producer.supplyType == need_type) {
                    let producerRow = optimalNeedFlow[producerIndex]
                    let supplySpend = optimalNeedFlow[producerRowIndex][producerIndex]

                    producer.supplyLeft -= supplySpend

                    for (let i = 0; i < numberOfBuildings; i++) {
                        if (producerRow[i] > 0) {
                            // We give something from producer to building i
                            let amountSuppliedToI = producerRow[i]
                            let consumerNeed = townState.get(i).needs.find(val => val.type === need_type)!
                            consumerNeed.left -= amountSuppliedToI

                            if (consumerNeed.suppliers === undefined) {
                                consumerNeed.suppliers = []
                            }
                            consumerNeed.suppliers.push({
                                from: producer.index,
                                supply: amountSuppliedToI
                            })
                        }
                    }
                }
            }

        }


        return townState
    }

    private static bfs(rGraph: number[][], s: number, t: number, parent: number[]): boolean {
        let visited = [];
        let queue = [];
        let V = rGraph.length;
        // Create a visited array and mark all vertices as not visited
        for (let i = 0; i < V; i++) {
            visited[i] = false;
        }
        // Create a queue, enqueue source vertex and mark source vertex as visited
        queue.push(s);
        visited[s] = true;
        parent[s] = -1;

        while (queue.length != 0) {
            let u = queue.shift()!;
            for (let v = 0; v < V; v++) {
                if (visited[v] == false && rGraph[u][v] > 0) {
                    queue.push(v);
                    parent[v] = u;
                    visited[v] = true;
                }
            }
        }
        //If we reached sink in BFS starting from source, then return true, else false
        return visited[t];
    }

    private static fordFulkerson(graph: number[][], s: number, t: number): number[][] {
        /* Create a residual graph and fill the residual graph
         with given capacities in the original graph as
         residual capacities in residual graph

         Residual graph where rGraph[i][j] indicates
         residual capacity of edge from i to j (if there
         is an edge. If rGraph[i][j] is 0, then there is
         not)
        */
        if (s < 0 || t < 0 || s > graph.length - 1 || t > graph.length - 1) {
            throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid sink or source");
        }
        if (graph.length === 0) {
            throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph");
        }

        // Init Graph with residues
        let rGraph = [];
        for (let u = 0; u < graph.length; u++) {
            let temp = [];
            if (graph[u].length !== graph.length) {
                throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph. graph needs to be NxN");
            }
            for (let v = 0; v < graph.length; v++) {
                temp.push(graph[u][v]);
            }
            rGraph.push(temp);
        }
        let parent: number[] = [];
        let maxFlow = 0;

        while (this.bfs(rGraph, s, t, parent)) {
            let pathFlow = Number.MAX_VALUE;

            for (let v = t; v != s; v = parent[v]) {
                let u = parent[v];
                pathFlow = Math.min(pathFlow, rGraph[u][v]);
            }
            for (let v = t; v != s; v = parent[v]) {
                let u = parent[v];
                rGraph[u][v] -= pathFlow;
                rGraph[v][u] += pathFlow;
            }

            maxFlow += pathFlow;
        }
        // Return the overall flow
        return transpose(rGraph);
    }
}

export type TownBuilding = {
    index: Vector2,
    iterationIndex: number,
    supply: number,
    supplyLeft: number,
    supplyType: BuildingNeed,
    needs: {
        type: BuildingNeed,
        left: number,
        suppliers?: {
            from: Vector2,
            supply: number
        }[]
    }[]
    consumers?: {
        to: Vector2,
        supply: number
    }[]
}