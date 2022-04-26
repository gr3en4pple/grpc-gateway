import grpc from '@grpc/grpc-js';
import ProtoLoader from '@grpc/proto-loader';

const PROTO_PATH = './actor.proto';
const pkgDefinition = ProtoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(pkgDefinition);

const actorService = new grpcObject.ActorService('127.0.0.1:4000', grpc.credentials.createInsecure());
export default actorService;
