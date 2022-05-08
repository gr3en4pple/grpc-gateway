import grpc from '@grpc/grpc-js';
import ProtoLoader from '@grpc/proto-loader';

const PROTO_PATH = './film.proto';
const pkgDefinition = ProtoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(pkgDefinition);

const filmService = new grpcObject.FilmService('127.0.0.1:4001', grpc.credentials.createInsecure());
export default filmService;
