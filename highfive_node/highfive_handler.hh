// myobject.h
#ifndef HIGHFIVE_HANDLER_HH
#define HIGHFIVE_HANDLER_HH

#include <highfive/H5File.hpp>
#include <node.h>
#include <node_object_wrap.h>
#include <string>
using HighFive::File;

namespace demo {

class HighFiveHandler : public node::ObjectWrap {
public:
  static void Init(v8::Local<v8::Object> exports);

private:
  explicit HighFiveHandler(const std::string filename);
  ~HighFiveHandler();

  static void create(const v8::FunctionCallbackInfo<v8::Value> &args);
  static void list(const v8::FunctionCallbackInfo<v8::Value> &args);

  File _file;
};

} // namespace demo

#endif // HIGHFIVE_HANDLER_HH