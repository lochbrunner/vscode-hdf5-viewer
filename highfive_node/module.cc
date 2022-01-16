// hello.cc
#include <highfive/H5File.hpp>
#include <node.h>
#include <sstream>
#include <string>

#include "highfive_handler.hh"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

using HighFive::File;

void Initialize(Local<Object> exports) { HighFiveHandler::Init(exports); }

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

} // namespace demo